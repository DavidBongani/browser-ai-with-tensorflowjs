# Lesson 11 — Visualizing the Training Process

This lesson uses TensorFlow.js 4.22.0 and tfjs-vis 1.5.1.

The training callbacks render loss and accuracy while `model.fit()` runs.

The browser test requires:

- 8 epochs of history;
- finite loss/accuracy values;
- tfjs-vis loaded;
- at least one actual SVG or Canvas chart rendered in the DOM.
