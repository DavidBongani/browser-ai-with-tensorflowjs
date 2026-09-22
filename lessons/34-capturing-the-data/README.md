# Lesson 34 — Capturing the Data

Transfer learning needs labelled examples.

For an image classifier, each captured example contains two pieces of
information:

1. the feature vector produced by the pretrained model;
2. the class ID assigned by the learner.

This lesson captures one example at a time.

## From pixels to features

MobileNet does not need to be retrained for every new class. Instead, it can be
used as a feature extractor:

```javascript
const embedding = featureExtractor.infer(
  source,
  true,
);
```

The `true` argument asks MobileNet for the internal embedding instead of the
final ImageNet classification result.

The automated browser example uses a canvas because it is deterministic and
works in CI. In an interactive application, the same capture function can
receive an image, canvas or current webcam frame.

## What one captured example contains

After reading the embedding values, the lesson stores:

```javascript
{
  classId,
  classCount,
  featureValues,
  embeddingSize,
}
```

The temporary embedding tensor is disposed immediately after its values have
been copied. Keeping ordinary JavaScript data at this stage makes ownership
clear and avoids accumulating unreleased tensors while examples are collected.

## Class counts

The page maintains a simple count for each class:

```text
class 1 / class 2 / class 3
```

The browser test captures one example for each class and verifies that the
three examples use the same MobileNet embedding width.

Lesson 35 wraps captured examples in a Dataset class that can validate the
collection and materialize training tensors.

## Source code

The complete source for this lesson is preserved in this lesson directory.
