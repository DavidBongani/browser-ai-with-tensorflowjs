# Lesson 6 — Designing the Iris Neural Network

The Iris data contract determines two important dimensions:

```text
4 input features
3 target classes
```

This lesson builds:

```text
Dense(8, relu)
→ Dense(3, softmax)
```

and compiles the classifier with Adam, categorical cross-entropy and accuracy.

The tests verify the input/output shapes and activations.
