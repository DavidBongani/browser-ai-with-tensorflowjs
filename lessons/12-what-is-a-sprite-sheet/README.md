# Lesson 12 — What Is a Sprite Sheet?

This lesson inspects the local MNIST browser sprite used later in Module 2.

The TensorFlow.js MNIST asset is:

- width: 784 pixels;
- height: 65,000 rows;
- one flattened 28×28 grayscale digit per row.

The page reconstructs the first 784-pixel row into a visible 28×28 canvas image and verifies that the label file contains 650,000 bytes (65,000 one-hot vectors × 10 classes).
