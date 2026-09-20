# Lesson 15 — MNIST Classifier in Code

This is the cumulative MNIST browser project for Module 2.

It:

- loads 6,000 real MNIST training examples from the checked-in sprite;
- loads 1,000 held-out examples from the official test portion beginning at row 55,000;
- trains the Module 2 CNN for four epochs;
- visualizes training with tfjs-vis;
- evaluates held-out accuracy;
- renders a real held-out digit into a 280×280 drawing canvas;
- classifies the canvas via tf.browser.fromPixels();
- verifies repeated canvas inference does not increase the live tensor count.

After training, the user can clear the canvas, draw a digit and classify it.
