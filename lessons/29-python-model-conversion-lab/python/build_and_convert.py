from __future__ import annotations

import importlib
import importlib.metadata
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
import types

os.environ.setdefault("PYTHONHASHSEED", "0")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import h5py
import numpy as np
import tensorflow as tf
import tf_keras as keras

LESSON_DIR = Path(__file__).resolve().parents[1]
DESTINATION = LESSON_DIR / "web-model"
STAGING = LESSON_DIR / ".web-model-staging"
INPUT = np.asarray([[3.0, 4.0]], dtype=np.float32)
EXPECTED = np.asarray([[7.0, -1.0]], dtype=np.float32)


def load_h5_converter():
    distribution = importlib.metadata.distribution("tensorflowjs")
    package_dir = Path(distribution.locate_file("tensorflowjs")).resolve()

    package = types.ModuleType("tensorflowjs")
    package.__path__ = [str(package_dir)]
    package.__package__ = "tensorflowjs"
    sys.modules["tensorflowjs"] = package

    converters_name = "tensorflowjs.converters"
    converters_dir = package_dir / "converters"
    converters = types.ModuleType(converters_name)
    converters.__path__ = [str(converters_dir)]
    converters.__package__ = converters_name
    sys.modules[converters_name] = converters

    return importlib.import_module(
        "tensorflowjs.converters.keras_h5_conversion"
    )


def build_model():
    np.random.seed(29)
    tf.random.set_seed(29)

    model = keras.Sequential(
        [
            keras.layers.Input(shape=(2,), name="features"),
            keras.layers.Dense(
                2,
                activation="linear",
                name="sum_difference",
            ),
        ],
        name="lesson_29_lab",
    )

    model.get_layer("sum_difference").set_weights(
        [
            np.asarray(
                [
                    [1.0, 1.0],
                    [1.0, -1.0],
                ],
                dtype=np.float32,
            ),
            np.asarray([0.0, 0.0], dtype=np.float32),
        ]
    )

    actual = model(INPUT, training=False).numpy()
    if not np.allclose(actual, EXPECTED, atol=1e-6):
        raise RuntimeError(
            f"Python prediction mismatch: {actual.tolist()}"
        )

    return model, actual


def convert(model):
    conversion = load_h5_converter()

    if STAGING.exists():
        shutil.rmtree(STAGING)
    STAGING.mkdir(parents=True, exist_ok=False)

    try:
        with tempfile.TemporaryDirectory(prefix="lesson29-") as temp_dir:
            source_h5 = Path(temp_dir) / "lab-model.h5"
            model.save(
                source_h5,
                include_optimizer=False,
                save_format="h5",
            )

            with h5py.File(source_h5, "r") as source:
                topology, weight_groups = (
                    conversion.h5_merged_saved_model_to_tfjs_format(source)
                )

            conversion.write_artifacts(
                topology,
                weight_groups,
                str(STAGING),
            )

        manifest = json.loads(
            (STAGING / "model.json").read_text("utf-8")
        )

        if manifest.get("format") != "layers-model":
            raise RuntimeError("Expected a LayersModel.")
        if manifest.get("convertedBy") != "TensorFlow.js Converter v4.22.0":
            raise RuntimeError("Unexpected converter version.")

        shard = STAGING / "group1-shard1of1.bin"
        if not shard.exists() or shard.stat().st_size != 24:
            raise RuntimeError("Unexpected weight shard.")

        if DESTINATION.exists():
            shutil.rmtree(DESTINATION)
        STAGING.replace(DESTINATION)
    finally:
        if STAGING.exists():
            shutil.rmtree(STAGING)


def main():
    model, actual = build_model()
    convert(model)

    evidence = {
        "input": INPUT[0].tolist(),
        "pythonOutput": actual[0].tolist(),
        "operations": [
            "sum = x0 + x1",
            "difference = x0 - x1",
        ],
    }

    (LESSON_DIR / "lab-evidence.json").write_text(
        json.dumps(evidence, indent=2) + "\n",
        encoding="utf-8",
    )

    print("LESSON_29_LAB=PASS")
    print(json.dumps(evidence, sort_keys=True))


if __name__ == "__main__":
    main()
