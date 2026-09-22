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
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")

import h5py
import numpy as np
import tensorflow as tf
import tf_keras as keras

tf.config.experimental.enable_op_determinism()
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)

LESSON_DIR = Path(__file__).resolve().parents[1]
DESTINATION = LESSON_DIR / "web-model"
STAGING = LESSON_DIR / ".web-model-staging"


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


def make_dataset():
    points = []
    labels = []

    for x0 in (-3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0):
        for x1 in (-3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0):
            if x0 + x1 == 0:
                continue

            points.append([x0, x1])
            labels.append([1.0 if x0 + x1 > 0 else 0.0])

    return (
        np.asarray(points, dtype=np.float32),
        np.asarray(labels, dtype=np.float32),
    )


def train_classifier():
    np.random.seed(30)
    tf.random.set_seed(30)

    xs, ys = make_dataset()

    model = keras.Sequential(
        [
            keras.layers.Input(shape=(2,), name="point"),
            keras.layers.Dense(
                1,
                activation="sigmoid",
                name="positive_half_plane",
                kernel_initializer="zeros",
                bias_initializer="zeros",
            ),
        ],
        name="lesson_30_classifier",
    )

    model.compile(
        optimizer=keras.optimizers.SGD(learning_rate=0.1),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    history = model.fit(
        xs,
        ys,
        epochs=250,
        batch_size=len(xs),
        shuffle=False,
        verbose=0,
    )

    # TensorFlow can differ by a few ULPs across CPU kernels/operating systems.
    # Canonicalise the learned parameters before serialization so the
    # converted TensorFlow.js artifact is byte-for-byte reproducible without
    # hard-coding the target solution.
    layer = model.get_layer("positive_half_plane")
    learned_kernel, learned_bias = layer.get_weights()

    canonical_kernel = np.round(
        learned_kernel,
        decimals=6,
    ).astype(np.float32)
    canonical_bias = np.round(
        learned_bias,
        decimals=6,
    ).astype(np.float32)

    canonical_kernel[
        np.abs(canonical_kernel) < 0.5e-6
    ] = 0.0
    canonical_bias[
        np.abs(canonical_bias) < 0.5e-6
    ] = 0.0

    layer.kernel.assign(canonical_kernel)
    layer.bias.assign(canonical_bias)

    loss, accuracy = model.evaluate(
        xs,
        ys,
        batch_size=len(xs),
        verbose=0,
    )

    checks = np.asarray(
        [
            [3.0, 1.0],
            [-3.0, -1.0],
            [2.0, -1.0],
            [-2.0, 1.0],
        ],
        dtype=np.float32,
    )

    probabilities = model(
        checks,
        training=False,
    ).numpy().reshape(-1)

    expected_labels = np.asarray(
        [1, 0, 1, 0],
        dtype=np.int32,
    )
    predicted_labels = (probabilities >= 0.5).astype(np.int32)

    if float(accuracy) < 0.98:
        raise RuntimeError(
            f"Training accuracy below assignment gate: {accuracy}"
        )

    if not np.array_equal(
        predicted_labels,
        expected_labels,
    ):
        raise RuntimeError(
            "Held-out classification contract failed: "
            f"{probabilities.tolist()}"
        )

    return {
        "model": model,
        "history": history,
        "trainingLoss": float(loss),
        "trainingAccuracy": float(accuracy),
        "checks": checks,
        "probabilities": probabilities,
        "expectedLabels": expected_labels,
        "serializationPrecisionDecimals": 6,
        "probabilityPrecisionDecimals": 7,
    }


def convert(model):
    conversion = load_h5_converter()

    if STAGING.exists():
        shutil.rmtree(STAGING)
    STAGING.mkdir(parents=True, exist_ok=False)

    try:
        with tempfile.TemporaryDirectory(prefix="lesson30-") as temp_dir:
            source_h5 = Path(temp_dir) / "classifier.h5"
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

        if DESTINATION.exists():
            shutil.rmtree(DESTINATION)
        STAGING.replace(DESTINATION)
    finally:
        if STAGING.exists():
            shutil.rmtree(STAGING)


def main():
    result = train_classifier()
    model = result["model"]
    convert(model)

    weights, bias = model.get_layer(
        "positive_half_plane"
    ).get_weights()

    evidence = {
        "task": "classify whether x0 + x1 is positive",
        "trainingAccuracy": result["trainingAccuracy"],
        "trainingLoss": result["trainingLoss"],
        "learnedWeights": weights[:, 0].tolist(),
        "learnedBias": float(bias[0]),
        "checks": result["checks"].tolist(),
        "pythonProbabilities": [
            round(float(value), result["probabilityPrecisionDecimals"])
            for value in result["probabilities"]
        ],
        "expectedLabels": result["expectedLabels"].tolist(),
        "serializationPrecisionDecimals": result["serializationPrecisionDecimals"],
        "probabilityPrecisionDecimals": result["probabilityPrecisionDecimals"],
    }

    (LESSON_DIR / "assignment-evidence.json").write_text(
        json.dumps(evidence, indent=2) + "\n",
        encoding="utf-8",
    )

    print("LESSON_30_ASSIGNMENT=PASS")
    print(json.dumps(evidence, sort_keys=True))


if __name__ == "__main__":
    main()
