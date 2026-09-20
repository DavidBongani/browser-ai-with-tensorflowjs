# Lesson 4 — Reading Iris Data with tf.data.csv()

This lesson uses TensorFlow.js `tf.data.csv()` to read the checked-in Iris CSV over HTTP.

The `species` column is configured with `isLabel: true`, so each dataset element contains:

```text
xs → four measurement features
ys → species label
```

The browser test verifies all 150 examples can be read.
