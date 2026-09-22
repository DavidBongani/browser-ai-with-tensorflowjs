# Lesson 32 — Retraining the MobileNet Model

Transfer learning reuses a pretrained model as a feature extractor and trains a
new classifier for the classes required by the new application.

MobileNet already knows how to transform an image into useful visual features.
Instead of training an image network from the beginning, this lesson asks
MobileNet for its embedding:

```javascript
const embedding = featureExtractor.infer(image, true);
```

Passing `true` requests the embedding rather than the original ImageNet
classification logits.

A new TensorFlow.js classifier is then created on top of that embedding. The
classifier in this lesson has:

- an input matching the MobileNet embedding width;
- a hidden Dense layer with 100 ReLU units;
- a three-unit softmax output layer;
- categorical cross-entropy loss;
- the Adam optimiser.

The pretrained MobileNet feature extractor is not trained by this classifier.
The new classifier head is the part that will learn the new classes.

## Why use embeddings

An embedding is a compact numeric description of the visual information that
MobileNet has already learned. Two images that contain related visual patterns
can produce embeddings that are useful to a small classifier even when the new
class names were not part of MobileNet's original ImageNet task.

This greatly reduces the amount of data and computation needed for a browser
transfer-learning application.

## What this lesson proves

The browser example:

1. loads MobileNet V2;
2. draws a deterministic 224 × 224 image;
3. extracts a real MobileNet embedding;
4. reads the embedding width;
5. creates a three-class classifier head with the matching input width;
6. verifies the new classifier's output shape.

The training procedure itself is added in Lesson 33.
