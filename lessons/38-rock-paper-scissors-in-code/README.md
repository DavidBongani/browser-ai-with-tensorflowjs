# Lesson 38 — Rock Paper Scissors In Code

This lesson combines the transfer-learning pieces from Lessons 31–37 into a
complete Rock Paper Scissors application.

The application has three stages:

1. train a three-class classifier from captured-style embeddings;
2. classify a new embedding as rock, paper or scissors;
3. apply the ordinary Rock Paper Scissors rules to decide the round.

## Machine learning and deterministic rules

The classifier answers:

> Which move does this embedding represent?

The game logic answers:

> Who wins when these two moves are compared?

Those are different responsibilities.

Machine learning handles the uncertain classification problem.

Deterministic JavaScript handles the exact game rules:

```text
rock beats scissors
paper beats rock
scissors beats paper
```

This separation is important. A model should not be trained to learn a rule
that can be expressed exactly in code.

## Training the classifier

The page uses the same Dataset, classifier model and training function developed
in the preceding lessons.

After training, the three move buttons are enabled.

Each move button provides a representative embedding to the trained classifier.

The result includes the predicted move, class confidence, computer move and
round winner.

## Source code

The complete source for this lesson is preserved in this lesson directory.
