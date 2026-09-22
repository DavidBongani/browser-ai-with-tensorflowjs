# Lesson 36 — Training the Network with Captured Data

The previous lessons separated transfer learning into three parts:

1. capture one labelled embedding;
2. store examples in a Dataset;
3. define a reusable training function.

This lesson connects those parts.

## Training flow

The Dataset first materializes its stored examples:

```javascript
const { xs, ys } = dataset.toTensors(tf);
```

A classifier is then created with an input width that matches the captured
embedding width.

Finally, the training function receives the classifier and the tensors:

```javascript
const result = await trainClassifier(
  model,
  xs,
  ys,
  {
    epochs: 60,
    batchSize: dataset.size,
    shuffle: false,
  },
);
```

The example order and model initializers are fixed so the teaching result is
repeatable.

## What to verify

A successful training run should:

- use all captured examples;
- preserve the feature and label tensor shapes;
- reduce the loss;
- reach high classification accuracy.

The example uses small deterministic feature vectors so the lesson can isolate
the training pipeline. In an image application, these rows would be MobileNet
embeddings captured from images or webcam frames.

The caller disposes the training tensors and model after the result has been
recorded.

Lesson 37 keeps the trained classifier alive long enough to perform inference
on a new example.

## Source code

The complete source for this lesson is preserved in this lesson directory.
