# Lesson 18 — Pre-trained TensorFlow.js Models

A pre-trained model has learned its weights before the current application starts.

This lesson separates **training** from **inference**. The browser loads a saved
TensorFlow.js Layers model with `tf.loadLayersModel()` and uses it immediately
for predictions. It never calls `model.fit()`.

The supplied model represents the already-learned rule:

`y = 2x + 1`

For inputs `0`, `1`, and `2`, the loaded model should therefore predict
`1`, `3`, and `5`.

## Why this matters

In Modules 1 and 2, the browser created and trained models itself. Pre-trained
models change that workflow: training can happen earlier or elsewhere, and the
finished model can be loaded later for inference.

This same separation underpins larger ready-made TensorFlow.js models. Later
lessons apply the idea to specific model families.

## Run the lesson

Serve the repository root over HTTP, then open:

`/lessons/18-pretrained-models/`

The page loads `assets/model.json` plus its binary weight shard and displays
the predictions.

## Evidence

The automated checks verify that:

- the model manifest and weight shard exist;
- the browser runtime calls `tf.loadLayersModel()`;
- the runtime contains no `model.fit()` training step;
- the model loads successfully in Chromium;
- inference returns the expected predictions.

## Implementation checkpoint

The tested implementation for this lesson is preserved at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/bb72a352bad434c0bb02be6ccb730e313660d68c
