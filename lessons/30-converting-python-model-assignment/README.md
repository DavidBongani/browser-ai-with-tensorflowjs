# Lesson 30 â€” Programming Assignment: Converting a Python Model to JavaScript

This original programming assignment closes Module 3 by requiring the complete
Python-to-browser workflow on a trained classifier.

## Assignment

Train a Python model that classifies whether a two-dimensional point belongs to
the positive half-plane:

```text
positive class: x0 + x1 > 0
negative class: x0 + x1 < 0
```

Points exactly on the boundary are omitted from the training set.

The completed solution must:

1. generate the training examples in Python;
2. build a TF-Keras binary classifier;
3. train with `model.fit()`;
4. reach at least 98% training accuracy;
5. classify the four assignment check points correctly;
6. save a temporary HDF5 model;
7. convert it with TensorFlow.js Converter 4.22.0;
8. commit the generated TensorFlow.js model artifacts;
9. load the converted model with `tf.loadLayersModel()`;
10. run the same check points in Chromium;
11. match Python probabilities within `1e-5`.

Run the reference solution:

```powershell
.\.venv\Scripts\python.exe lessons\30-converting-python-model-assignment\python\train_convert_classifier.py
```

## Cross-platform serialization

TensorFlow CPU kernels can differ by a few floating-point units across operating
systems even when the same seeds and deterministic execution settings are used.
The assignment therefore rounds the **learned** kernel and bias to six decimal
places immediately after training and before conversion.

This does not provide the model with the target solution. The parameters still
come from `model.fit()`. The normalization only gives the trained model one
canonical serialized representation so Windows and Linux generate the same
TensorFlow.js artifacts.

## Verification points

The assignment evaluates:

```text
[ 3,  1] -> positive
[-3, -1] -> negative
[ 2, -1] -> positive
[-2,  1] -> negative
```

The exact probabilities are learned rather than hard-coded. The correctness
contract is the class decision and numerical parity between Python and the
browser.

## Completion standard

The assignment is complete only when:

- the Python accuracy gate passes;
- the generated artifacts are reproducible;
- the browser classifications are correct;
- Python/browser probabilities agree;
- the accumulated repository test suite remains green.

## Source code

The complete implementation for this assignment is preserved at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/628e50d33ab2b3046cbe13a9499bbee7e0ad3fe8
