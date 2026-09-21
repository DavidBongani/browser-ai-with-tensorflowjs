# Lesson 25 — Converting Models to JavaScript

Python TensorFlow and Keras models are not normally copied directly into a web
application. TensorFlow.js Converter translates supported source formats into
artifacts the JavaScript runtime can load.

For a Keras HDF5 source, the converter uses `--input_format=keras` and emits a
TensorFlow.js Layers model.

For a TensorFlow SavedModel source, the converter uses
`--input_format=tf_saved_model` and emits a TensorFlow.js Graph model.

The converted directory normally contains:

- `model.json`, which describes the graph or layer topology and weight manifest;
- one or more binary weight shards such as `group1-shard1of1.bin`.

The browser later loads the resulting model with the corresponding TensorFlow.js
loader, such as `tf.loadLayersModel()` or `tf.loadGraphModel()`.

This lesson focuses on the conversion contract and command structure. Lesson 26
performs a real conversion and verifies the generated JavaScript model.
