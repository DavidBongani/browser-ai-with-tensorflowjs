# Lesson 31 — Building a Simple Web Page

Transfer learning still needs an ordinary web interface around the model.

This lesson builds that interface before any machine-learning code is added.
Keeping the first step simple makes it easier to separate browser problems
from model problems later.

The page contains:

- a 224 × 224 video surface for webcam frames;
- a button for starting camera work;
- three buttons for collecting class examples;
- a visible count for each class;
- a training button;
- a prediction button;
- status and prediction output areas.

The page state is intentionally deterministic. A class count increases when its
capture button is pressed. Training becomes available only after every class
has at least one example. Prediction remains disabled until the training action
has completed.

No MobileNet model is loaded yet. Lesson 32 adds the pretrained feature
extractor. Later lessons replace these placeholder interactions with real image
capture, dataset storage, classifier training and inference.

## Why start with the page

A transfer-learning application combines ordinary browser engineering with
machine learning. Building the interface first lets you verify:

1. the controls exist;
2. state changes are visible;
3. training cannot start without data;
4. prediction cannot start before training;
5. the camera and model responsibilities have clear places in the page.

That structure will remain in place as the remaining Module 4 lessons add the
actual learning pipeline.

## Source code

The complete source for this lesson is available at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/827bc71d6bda12fba979b941bc25c0c9e3232368
