# Lesson 37 — Performing Inference

After a transfer-learning classifier has been trained, the next step is to use
it on a new example.

Inference has two stages:

1. produce an embedding for the new input;
2. pass that embedding through the trained classifier.

This lesson focuses on the second stage.

## Classifying one embedding

The helper receives:

- TensorFlow.js;
- the trained classifier;
- one embedding;
- the class names.

It creates a rank-2 input tensor with one row, runs `model.predict()`, reads the
softmax scores and finds the class with the largest score.

The result contains:

```javascript
{
  classId,
  className,
  confidence,
  scores,
}
```

## Tensor ownership

The inference helper owns the temporary input and prediction tensors.

Both are disposed before the function returns.

That keeps repeated inference from leaking tensors.

## End-to-end example

The browser example:

1. creates the same three-class Dataset used in the previous lesson;
2. trains a small classifier;
3. classifies a new triangle-like embedding;
4. returns the predicted class name and confidence.

The browser test requires the trained classifier to predict `triangle` for the
new example.

Lesson 38 connects the complete transfer-learning workflow to a Rock Paper
Scissors application.

## Source code

The complete source for this lesson is preserved in this lesson directory.
