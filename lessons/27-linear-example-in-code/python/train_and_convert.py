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
TEST_INPUT = np.asarray([[4.0]], dtype=np.float32)


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


def train_model():
    np.random.seed(27)
    tf.random.set_seed(27)

    xs = np.asarray(
        [[-3.0], [-2.0], [-1.0], [0.0], [1.0], [2.0], [3.0]],
        dtype=np.float32,
    )
    ys = 3.0 * xs + 1.0

    model = keras.Sequential(
        [
            keras.layers.Input(shape=(1,), name="x"),
            keras.layers.Dense(
                1,
                activation="linear",
                name="linear",
                kernel_initializer="zeros",
                bias_initializer="zeros",
            ),
        ],
        name="lesson_27_linear",
    )

    model.compile(
        optimizer=keras.optimizers.SGD(learning_rate=0.05),
        loss="mean_squared_error",
    )

    history = model.fit(
        xs,
        ys,
        epochs=120,
        batch_size=len(xs),
        shuffle=False,
        verbose=0,
    )

    prediction = float(
        model(TEST_INPUT, training=False).numpy()[0, 0]
    )
    final_loss = float(history.history["loss"][-1])

    if abs(prediction - 13.0) > 0.01:
        raise RuntimeError(
            f"Python prediction did not converge: {prediction}"
        )

    return model, prediction, final_loss


def convert_model(model):
    conversion = load_h5_converter()

    if STAGING.exists():
        shutil.rmtree(STAGING)
    STAGING.mkdir(parents=True, exist_ok=False)

    try:
        with tempfile.TemporaryDirectory(prefix="lesson27-") as temp_dir:
            source_h5 = Path(temp_dir) / "trained-linear.h5"
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
            raise RuntimeError("Expected a TensorFlow.js LayersModel.")
        if manifest.get("convertedBy") != "TensorFlow.js Converter v4.22.0":
            raise RuntimeError("Unexpected converter version.")

        if DESTINATION.exists():
            shutil.rmtree(DESTINATION)
        STAGING.replace(DESTINATION)
    finally:
        if STAGING.exists():
            shutil.rmtree(STAGING)


def main():
    model, prediction, final_loss = train_model()
    convert_model(model)

    weights, bias = model.get_layer("linear").get_weights()
    evidence = {
        "pythonPredictionAt4": prediction,
        "finalLoss": final_loss,
        "learnedWeight": float(weights[0, 0]),
        "learnedBias": float(bias[0]),
        "expectedRule": "y = 3x + 1",
    }

    (LESSON_DIR / "training-evidence.json").write_text(
        json.dumps(evidence, indent=2) + "\n",
        encoding="utf-8",
    )

    print("LESSON_27_TRAIN_CONVERT=PASS")
    print(json.dumps(evidence, sort_keys=True))


if __name__ == "__main__":
    main()
