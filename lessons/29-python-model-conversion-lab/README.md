# Lesson 29 — Python Model Conversion Lab

This is an original ungraded lab for practising the Python-to-TensorFlow.js
conversion workflow from start to finish.

The model accepts two numbers:

```text
[x0, x1]
```

and returns two values:

```text
sum        = x0 + x1
difference = x0 - x1
```

For the lab input `[3, 4]`, Python and the browser must both return:

```text
[7, -1]
```

## Lab tasks

Work through the pipeline in this order:

1. inspect the TF-Keras model in `python/build_and_convert.py`;
2. run the Python model and verify its output;
3. save the temporary HDF5 source model;
4. convert it with TensorFlow.js Converter 4.22.0;
5. inspect `web-model/model.json`;
6. inspect the generated binary weight shard;
7. load the converted model with `tf.loadLayersModel()`;
8. run the same input in Chromium;
9. compare Python and browser outputs.

Run the lab build:

```powershell
.\.venv\Scripts\python.exe lessons\29-python-model-conversion-lab\python\build_and_convert.py
```

The generated browser artifacts are committed so they can be served directly,
but the source HDF5 file is temporary and is not committed.

## What to inspect

In `model.json`, identify:

- the model format;
- the model name;
- the input shape;
- the output shape;
- the weight manifest;
- the binary shard path.

The browser test passes only when the converted model returns the same two
numbers recorded by Python.
