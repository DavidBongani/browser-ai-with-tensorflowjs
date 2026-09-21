# Lesson 22 — Using MobileNet

This lesson loads the real pretrained MobileNet package in the browser and
classifies image pixels.

The application uses:

- TensorFlow.js 4.22.0;
- `@tensorflow-models/mobilenet` 2.1.1;
- MobileNet V2 with alpha 1.0;
- a browser `canvas` as the image source;
- `model.classify()` for inference.

MobileNet returns ranked ImageNet predictions. Each prediction contains a class
name and probability.

No training occurs here. The browser loads pretrained weights and performs
inference only.

The browser test verifies that the real model loads and returns three finite,
ranked prediction objects from actual canvas pixels.
