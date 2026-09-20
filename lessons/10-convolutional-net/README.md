# Lesson 10 — Creating a Convolutional Net with JavaScript

This checkpoint builds the first CNN used by Module 2.

Input:

```text
[28, 28, 1]
```

Architecture:

```text
Conv2D(8, 5×5, ReLU)
→ MaxPool(2×2)
→ Conv2D(16, 5×5, ReLU)
→ MaxPool(2×2)
→ Flatten
→ Dense(10, Softmax)
```

The tests verify the model's input/output contract and layer-by-layer output shapes.
