# Lesson 39 — Programming Assignment: Rock Paper Scissors

This capstone assignment combines the complete transfer-learning workflow into
one browser application.

The application must:

1. build a labelled Dataset;
2. train a three-class classifier;
3. classify new embeddings as rock, paper or scissors;
4. resolve each round with deterministic game rules;
5. maintain a running score;
6. record round history;
7. reset the session without retraining the classifier.

## Assignment target

The classifier handles the learned problem:

```text
embedding → rock | paper | scissors
```

The game engine handles exact rules:

```text
rock beats scissors
paper beats rock
scissors beats paper
```

The score object tracks player wins, computer wins and draws separately.

## Verification

The automated browser assignment:

- trains the classifier;
- plays three rounds using classified moves;
- verifies the score after each round;
- verifies round history;
- resets the session;
- confirms the score and history return to zero.

This completes the transfer-learning sequence and the course companion.

## Source code

The complete source for this assignment is preserved in this lesson directory.
