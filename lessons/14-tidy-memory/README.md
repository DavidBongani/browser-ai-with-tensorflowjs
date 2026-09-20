# Lesson 14 — Using tf.tidy() to Save Memory

This lesson demonstrates TensorFlow.js tensor lifetime directly.

The page:

1. records the baseline tensor count;
2. creates 20 batches of temporary image preprocessing tensors without immediate disposal;
3. proves the tensor count rises;
4. manually disposes those tensors;
5. performs 100 equivalent preprocessing iterations inside `tf.tidy()`;
6. verifies the tensor count remains stable.

The browser test uses `tf.memory().numTensors` as evidence.
