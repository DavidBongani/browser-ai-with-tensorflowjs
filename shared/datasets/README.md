# Dataset attribution

## Iris

Source: UCI Machine Learning Repository, Iris dataset.
DOI: 10.24432/C56C76
Original creator: R. A. Fisher.
Licence: CC BY 4.0.

The repository copy adds a CSV header for teaching convenience.

## Breast Cancer Wisconsin (Diagnostic)

Source: UCI Machine Learning Repository, Breast Cancer Wisconsin (Diagnostic).
DOI: 10.24432/C5DW2B
Creators: William Wolberg, Olvi Mangasarian, Nick Street, W. Street.
Licence: CC BY 4.0.

The repository copy adds a CSV header for teaching convenience.

## MNIST browser sprite assets

Files:
- `mnist/mnist_images.png`
- `mnist/mnist_labels_uint8`

Browser asset source:
TensorFlow.js examples / LearnJS data storage used by the TensorFlow.js MNIST example.

Reference implementation:
https://github.com/tensorflow/tfjs-examples/tree/master/mnist

Original dataset:
MNIST database of handwritten digits, created from NIST data and commonly attributed to Yann LeCun, Corinna Cortes and Christopher J. C. Burges.

The image asset stores 65,000 flattened 28 x 28 grayscale examples as a PNG sprite with width 784 pixels and one dataset example per sprite row. The label asset stores 65,000 one-hot vectors with 10 bytes per example.

These copies are checked into the companion repository so the book examples and CI use stable local assets rather than depending on a live external request.
