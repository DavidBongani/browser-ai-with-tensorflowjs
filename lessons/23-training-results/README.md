# Lesson 23 — Training Results

MobileNet classification returns a short ranked list rather than one isolated
answer. Each prediction contains a class name and a probability.

This lesson focuses on reading that output:

1. sort predictions from highest to lowest probability;
2. display each probability as a percentage;
3. identify the top prediction;
4. compare the top two scores using a confidence gap.

A probability is a model score for that class, not a guarantee that the class
is correct. Close top scores indicate more ambiguity than a large gap.

The example uses three MobileNet-shaped prediction objects so the result
interpretation is deterministic. Lesson 24 combines this presentation logic
with the real pretrained MobileNet browser model.

## Implementation checkpoint

The tested implementation for this lesson is preserved at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/11b0b890abfaf337f9662b953a616158e292a694
