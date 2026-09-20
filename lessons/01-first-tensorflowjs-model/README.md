# Lesson 1 — Your First TensorFlow.js Model

This directory contains the runnable code used by Lesson 1 of the book.

The model learns the relationship:

```text
y = 2x + 1
```

from examples rather than being given that formula directly.

## Run

Serve this directory with any local static web server and open `index.html`.

## Expected behaviour

After training, the model should predict a value close to `21` for `x = 10`.

The exact value varies because neural-network training begins from random initial weights.

## What this example demonstrates

- creating a Sequential model;
- adding a Dense layer;
- compiling with stochastic gradient descent and mean squared error;
- converting training examples into tensors;
- training with `model.fit()`;
- making a prediction with `model.predict()`.

## Test

The repository CI runs both unit and browser tests for this lesson.
