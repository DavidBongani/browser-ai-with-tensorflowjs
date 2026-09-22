# Lesson 35 — The Dataset Class

Captured examples become easier to manage when one object owns the collection.

The `Dataset` class in this lesson is responsible for:

- validating class IDs;
- validating feature arrays;
- enforcing one embedding width;
- keeping class counts;
- deciding whether every class has training data;
- converting stored examples into TensorFlow.js training tensors.

## Adding examples

Each stored example has the same shape introduced in Lesson 34:

```javascript
{
  classId,
  featureValues,
}
```

The first example establishes the embedding width. Later examples must use the
same number of features.

## Class balance

`dataset.counts` reports how many examples exist for each class.

`dataset.canTrain()` becomes true only after every class has at least one
example.

That does not guarantee a good model. It is simply the minimum data contract
required before training can begin.

## Materializing tensors

The Dataset class keeps ordinary JavaScript arrays while examples are being
collected.

Only when training is requested does it create:

```javascript
const { xs, ys } = dataset.toTensors(tf);
```

`xs` contains one embedding per row.

`ys` contains one-hot class labels.

The caller owns those tensors and must dispose them after training.

Lesson 36 uses this Dataset class to train a classifier from captured data.

## Source code

The complete source for this lesson is preserved in this lesson directory.
