# Lesson 20 — Toxicity Classifier In Code

Lesson 19 explained the output contract. This lesson loads the actual
TensorFlow.js toxicity model and runs classification in the browser.

The page uses:

- TensorFlow.js 4.22.0;
- `@tensorflow-models/toxicity` 1.2.2;
- a confidence threshold of `0.9`;
- `toxicity.load()` to load the pretrained model;
- `model.classify()` to classify text.

The browser displays all label-specific predictions, each with its raw
probability pair and thresholded `match` value.

## Important distinction

No training occurs in this lesson. The model is already trained. The browser
downloads the pretrained model assets and performs inference.

## Evidence

The automated browser test verifies that the real model loads, classifies text,
returns the expected seven toxicity labels, and emits two finite probabilities
for every label.
