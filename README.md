# Browser AI with TensorFlow.js

Open-source companion repository for the book **Browser AI with TensorFlow.js: From First Tensor to Intelligent Web Applications**.

## Purpose

This repository contains the runnable code, experiments, labs and automated tests used by the book.

The book and repository are designed so that a reader can learn by doing. Code is not considered book-ready merely because it looks correct: executable examples must be tested before they are promoted into the manuscript.

## Relationship to Piri

This repository does **not** contain the private Piri production codebase, private datasets, proprietary routing logic, memory architecture, product-specific heuristics or confidential implementation details.

Where useful, the book may explain how a general TensorFlow.js pattern could apply to a production assistant such as Piri. The runnable implementation here remains deliberately generic and open source.

## Repository structure

```text
lessons/        lesson-specific runnable examples
labs/           cumulative projects
shared/         reusable public teaching utilities
tests/          cross-lesson tests
docs/           repository and learning documentation
.github/        CI workflows
```

Each executable lesson should eventually contain:

```text
README.md
index.html
app.js or src/
test/
```

## Quality rule

A code sample may enter the published book only after:

1. its source exists in this repository;
2. dependencies are pinned;
3. the example runs;
4. automated tests pass;
5. browser behaviour is tested where relevant;
6. expected outputs are documented;
7. tensor shapes and ownership are checked;
8. memory stability is checked for repeated inference where relevant;
9. training/evaluation claims are backed by measured evidence.

## TensorFlow.js version

The current teaching baseline is:

```text
@tensorflow/tfjs 4.22.0
```

Version changes must be deliberate, tested and reflected in the book.

## Learning projects

The repository will grow cumulatively through:

- numeric regression;
- binary and multiclass classification;
- browser training telemetry;
- persistence and reload;
- CNN image classification;
- Canvas/fromPixels inference;
- pretrained-model applications;
- model conversion;
- transfer learning;
- a final generic browser AI assistant.

## Licence

Code in this repository is released under the MIT Licence unless a specific dataset or third-party component states otherwise.
