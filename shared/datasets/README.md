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

## Fashion-MNIST

Files:
- `fashion-mnist/train-images-idx3-ubyte.gz`
- `fashion-mnist/train-labels-idx1-ubyte.gz`
- `fashion-mnist/t10k-images-idx3-ubyte.gz`
- `fashion-mnist/t10k-labels-idx1-ubyte.gz`

Source:
Zalando Research Fashion-MNIST repository:
https://github.com/zalandoresearch/fashion-mnist

Fashion-MNIST contains 60,000 training images and 10,000 test images. Each example is a 28 x 28 grayscale image belonging to one of ten clothing classes.

The companion repository retains the original gzip-compressed IDX representation so the assignment teaches browser decompression, IDX parsing, normalization, one-hot encoding and CNN training from the source dataset format.
