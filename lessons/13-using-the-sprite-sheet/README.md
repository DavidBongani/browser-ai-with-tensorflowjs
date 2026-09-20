# Lesson 13 — Using the Sprite Sheet

This lesson converts a requested range of rows from the checked-in MNIST PNG sprite into normalized TensorFlow.js tensors.

For 100 examples:

- image tensor: `[100, 28, 28, 1]`
- label tensor: `[100, 10]`
- pixel range: `0..1`
- one-hot labels stay aligned with the same sprite row indexes.

The browser test uses the real local sprite and label assets.
