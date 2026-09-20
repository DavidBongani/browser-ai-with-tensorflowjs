# Lesson 17 — Programming Assignment: Fashion-MNIST Classifier

This assignment uses the real Fashion-MNIST dataset from Zalando Research.

Classes:

0 T-shirt/top
1 Trouser
2 Pullover
3 Dress
4 Coat
5 Sandal
6 Shirt
7 Sneaker
8 Bag
9 Ankle boot

The browser implementation decompresses the original IDX gzip files, parses IDX headers, normalizes 28×28 grayscale images, one-hot encodes labels, trains a CNN, visualizes training, evaluates held-out test data, and displays a real test image with its expected and predicted class.

The automated gate requires at least 70% held-out accuracy on the 500-example teaching test slice.
