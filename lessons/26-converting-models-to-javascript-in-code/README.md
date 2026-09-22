# Lesson 26 — Converting Models to JavaScript In Code

This lesson performs a real Python-to-browser model conversion.

A TF-Keras model is created in Python with one Dense layer. Its weights are
fixed so that the model computes:

`y = 2x₀ - x₁ + 0.5`

For the input `[3, 4]`, both Python and the browser must produce `2.5`.

## Conversion pipeline

The Python script:

1. creates the TF-Keras model;
2. assigns the exact weights `[2, -1]` and bias `0.5`;
3. verifies the Python prediction;
4. saves a temporary Keras HDF5 model;
5. uses the official TensorFlow.js 4.22.0 HDF5 conversion code;
6. generates `web-model/model.json`;
7. generates `web-model/group1-shard1of1.bin`;
8. validates the generated topology and raw weight bytes.

The source HDF5 file is temporary and is not committed.

## Isolated Python environment

Use Python 3.12 in a local virtual environment. Install the direct conversion
dependencies normally, then install TensorFlow.js with `--no-deps` because
the HDF5 LayersModel path does not require the package's JAX, Flax,
TensorFlow Decision Forests or TensorFlow Hub conversion dependencies.

```powershell
C:\Python312\python.exe -m venv .venv
.\.venv\Scripts\python.exe -m pip install tensorflow==2.21.0 keras==3.15.1 tf-keras==2.21.0 h5py==3.14.0
.\.venv\Scripts\python.exe -m pip install --no-deps tensorflowjs==4.22.0
```

Generate the model:

```powershell
.\.venv\Scripts\python.exe lessons\26-converting-models-to-javascript-in-code\python\create_and_convert.py
```

The browser then loads the generated artifact with:

```javascript
const model = await tf.loadLayersModel('./web-model/model.json');
```

The automated tests verify the committed converter output and execute real
Chromium inference against the converted model.

## Implementation checkpoint

The tested implementation for this lesson is preserved at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/554232d58732d4d585de062b84971b50a01178ad
