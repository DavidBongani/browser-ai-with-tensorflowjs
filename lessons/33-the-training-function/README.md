# Lesson 33 — The Training Function

Once MobileNet has converted images into embeddings, the new classifier needs a
training procedure.

This lesson isolates that procedure in a reusable `trainClassifier()`
function. Separating training from data collection keeps the application easier
to test and debug.

The training function receives:

- a compiled TensorFlow.js model;
- a rank-2 feature tensor;
- a rank-2 one-hot label tensor;
- the number of epochs;
- the batch size;
- whether examples should be shuffled.

Before training, the function verifies that the feature and label tensors
contain the same number of examples.

It then calls:

```javascript
await model.fit(xs, ys, {
  epochs,
  batchSize,
  shuffle,
  verbose: 0,
});
```

The function returns a compact summary containing the initial loss, final loss
and final accuracy.

## Deterministic teaching dataset

The browser example uses six small four-value embeddings split across three
classes. These stand in for the much larger embeddings that MobileNet produces.

The data is deliberately simple and separable so the lesson can focus on the
training function rather than on image capture.

The classifier uses fixed initializer seeds and a fixed example order. The
browser test requires training to reduce the loss substantially and reach high
classification accuracy.

Lesson 34 connects the transfer-learning pipeline to captured examples.

## Source code

The complete source for this lesson is available at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/ac2b844210fc15064e95a60a3a460e8884dc79d6
