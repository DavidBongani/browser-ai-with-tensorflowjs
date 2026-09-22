from __future__ import annotations

import importlib
import importlib.metadata
import json
import os
from pathlib import Path
import shutil
import struct
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
EXPECTED_INPUT = np.asarray([[3.0, 4.0]], dtype=np.float32)
EXPECTED_OUTPUT = 2.5


def load_official_h5_converter():
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
    np.random.seed(26)
    tf.random.set_seed(26)

    model = keras.Sequential(
        [
            keras.layers.Input(shape=(2,), name="features"),
            keras.layers.Dense(1, activation="linear", name="score"),
        ],
        name="lesson_26_linear",
    )
    model.get_layer("score").set_weights(
        [
            np.asarray([[2.0], [-1.0]], dtype=np.float32),
            np.asarray([0.5], dtype=np.float32),
        ]
    )
    actual = float(model(EXPECTED_INPUT, training=False).numpy()[0, 0])
    if abs(actual - EXPECTED_OUTPUT) > 1e-6:
        raise RuntimeError(f"Python inference mismatch: {actual}")
    return model


def validate_source_h5(path: Path):
    magic = path.read_bytes()[:8]
    if magic != bytes.fromhex("894844460d0a1a0a"):
        raise RuntimeError("Source is not an HDF5 file.")

    with h5py.File(path, "r") as source:
        for attribute in ("model_config", "keras_version", "backend"):
            if attribute not in source.attrs:
                raise RuntimeError(f"Missing HDF5 attribute: {attribute}")


def validate_artifacts(directory: Path):
    files = sorted(path.name for path in directory.iterdir() if path.is_file())
    if files != ["group1-shard1of1.bin", "model.json"]:
        raise RuntimeError(f"Unexpected generated files: {files}")

    model_json = json.loads((directory / "model.json").read_text("utf-8"))
    if model_json.get("format") != "layers-model":
        raise RuntimeError("Generated artifact is not a LayersModel.")
    if model_json.get("convertedBy") != "TensorFlow.js Converter v4.22.0":
        raise RuntimeError(f"Unexpected converter: {model_json.get('convertedBy')}")

    topology = model_json.get("modelTopology") or {}
    config = topology.get("model_config") or {}
    if config.get("class_name") != "Sequential":
        raise RuntimeError("Unexpected model topology.")
    if (config.get("config") or {}).get("name") != "lesson_26_linear":
        raise RuntimeError("Unexpected model name.")

    manifest = model_json.get("weightsManifest")
    if not isinstance(manifest, list) or len(manifest) != 1:
        raise RuntimeError("Expected one weights manifest group.")
    if manifest[0].get("paths") != ["group1-shard1of1.bin"]:
        raise RuntimeError("Unexpected weight shard path.")

    shard = (directory / "group1-shard1of1.bin").read_bytes()
    if len(shard) != 12:
        raise RuntimeError(f"Unexpected shard length: {len(shard)}")
    values = struct.unpack("<3f", shard)
    expected = (2.0, -1.0, 0.5)
    if any(abs(a - b) > 1e-6 for a, b in zip(values, expected)):
        raise RuntimeError(f"Unexpected weight bytes: {values}")


def main():
    model = build_model()
    conversion = load_official_h5_converter()

    if STAGING.exists():
        shutil.rmtree(STAGING)
    STAGING.mkdir(parents=True, exist_ok=False)

    try:
        with tempfile.TemporaryDirectory(prefix="lesson26-") as temp_dir:
            source_h5 = Path(temp_dir) / "lesson-26-model.h5"
            model.save(
                source_h5,
                include_optimizer=False,
                save_format="h5",
            )
            validate_source_h5(source_h5)

            with h5py.File(source_h5, "r") as source:
                topology, weight_groups = (
                    conversion.h5_merged_saved_model_to_tfjs_format(source)
                )

            conversion.write_artifacts(
                topology,
                weight_groups,
                str(STAGING),
            )

        validate_artifacts(STAGING)

        if DESTINATION.exists():
            shutil.rmtree(DESTINATION)
        STAGING.replace(DESTINATION)

        print("LESSON_26_CONVERSION=PASS")
        print(f"MODEL_JSON={DESTINATION / 'model.json'}")
        print(f"WEIGHTS={DESTINATION / 'group1-shard1of1.bin'}")
    finally:
        if STAGING.exists():
            shutil.rmtree(STAGING)


if __name__ == "__main__":
    main()

