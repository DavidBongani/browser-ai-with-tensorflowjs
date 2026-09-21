# Lesson 24 — MobileNet Example In Code

This lesson combines the previous MobileNet concepts into one complete browser
example.

The page:

1. loads TensorFlow.js;
2. loads the published MobileNet V2 model;
3. supplies browser image pixels through a canvas;
4. calls `model.classify()`;
5. receives the Top 3 ImageNet predictions;
6. renders each class name and probability into the page.

This is inference with pretrained weights. The application does not call
`model.fit()` and does not retrain MobileNet.

The automated browser gate executes the complete example with the real model
and verifies that all three returned predictions are also rendered to the DOM.
