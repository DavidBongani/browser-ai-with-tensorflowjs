# Lesson 27 — Linear Example In Code

This lesson trains a real linear model in Python, converts the trained model to
TensorFlow.js, and verifies that the browser produces the same inference result.

The training data follows the rule:

```text
y = 3x + 1
```

The Python model contains one input and one Dense output. It starts with zero
weight and zero bias, then learns from seven examples with `model.fit()`.

Training is deterministic:

- NumPy and TensorFlow seeds are fixed;
- the layer starts from zero weights;
- examples are not shuffled;
- the complete seven-example dataset is one batch;
- the model trains for 120 epochs.

After training, the expected parameters are approximately:

```text
weight ≈ 3
bias   ≈ 1
```

For `x = 4`, the expected output is approximately `13`.

## Python training and conversion

Run:

```powershell
.\.venv\Scripts\python.exe lessons\27-linear-example-in-code\python\train_and_convert.py
```

The script:

1. creates the training data;
2. trains the linear model with `model.fit()`;
3. records the learned weight, bias, loss and Python prediction;
4. saves a temporary HDF5 model;
5. converts it with TensorFlow.js Converter 4.22.0;
6. writes the browser model into `web-model/`.

The temporary HDF5 file is not committed.

## Browser verification

The browser loads the converted model with `tf.loadLayersModel()`, predicts
for `x = 4`, and compares its result with the Python-side prediction stored in
`training-evidence.json`.

The lesson passes only when Python and browser predictions differ by no more
than `1e-5`.
