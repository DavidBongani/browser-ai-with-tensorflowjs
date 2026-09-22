# Lesson 28 — Supported MobileNet Classes

MobileNet does not invent an unrestricted object name for every possible image.

The TensorFlow.js MobileNet classifier maps its output scores to a fixed
**1,000-class ImageNet vocabulary**. A prediction such as `golden retriever`,
`coffee mug` or `volcano` is selected from that vocabulary.

This lesson uses TensorFlow's upstream MobileNet ImageNet class table from
commit `c731b9ebbd6f4c9e8bf99b0df76bbdbf9c25b07f`. The browser examples in this
module use the published `@tensorflow-models/mobilenet` package version
`2.1.1`.

The upstream class table is licensed under the Apache License 2.0. Its original
copyright and licence notice are preserved in `imagenet-classes.js`.

## What a supported class means

A supported class is a label represented by one of the model's 1,000 output
positions.

For example:

```text
class 0   → tench, Tinca tinca
class 504 → coffee mug
class 999 → toilet tissue, toilet paper, bathroom tissue
```

Many labels contain aliases. One output position can therefore contain several
names for the same ImageNet class.

## Search the vocabulary

The browser example searches the real class table. Try terms such as:

```text
retriever
clock
volcano
mug
```

If a concept is absent from this vocabulary, MobileNet cannot return that
concept as a class label even when the image contains it.

This is a fundamental limitation of pretrained classification models: their
predictions are constrained by the categories represented in the model's
training label space.

## Implementation checkpoint

The complete implementation for this lesson is preserved at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/dee280cf4c9409906461ecadd7ad315fc3ca86dd
