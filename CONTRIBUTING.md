# Contributing

Contributions should improve correctness, clarity, reproducibility or educational value.

## Requirements

- Do not add private Piri or Paper source code.
- Do not add private datasets, credentials or production configuration.
- Pin important dependencies used by lesson code.
- Add or update tests for executable behaviour.
- Keep examples understandable to readers who only have the book and this repository.
- Document expected outputs and failure modes.
- Keep training, validation and test data roles explicit.
- Dispose temporary tensors correctly.
- Prefer deterministic fixtures for automated tests where practical.

## Pull-request standard

A change to lesson code should state:

- the lesson(s) affected;
- what concept the change teaches;
- how the code was tested;
- browser/runtime evidence where relevant;
- whether expected book output must change.
