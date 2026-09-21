# Lesson 19 — Toxicity Classifier

A toxicity classifier does not produce only one yes-or-no answer. It evaluates
text against several prediction heads such as insult, threat, identity attack,
obscenity, severe toxicity, sexual explicitness, and overall toxicity.

Each prediction result contains a pair of probabilities:

- probability that the label does not match;
- probability that the label does match.

A confidence threshold turns those probabilities into a final `match` value.

If the positive probability reaches the threshold, `match` is `true`.
If the negative probability reaches the threshold, `match` is `false`.
If neither side reaches the threshold, `match` is `null`.

This lesson demonstrates that output contract with fixed probabilities so the
threshold behaviour is visible and deterministic. The next lesson loads the
actual TensorFlow.js toxicity model and performs classification.

The TensorFlow.js toxicity package is `@tensorflow-models/toxicity`.
