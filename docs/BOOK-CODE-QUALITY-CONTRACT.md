# Book Code Quality Contract

This file is the executable-code gate for the companion book.

## Rule

No executable code is promoted into the manuscript until the corresponding repository implementation passes its required tests.

## Minimum checks

For ordinary JavaScript examples:

- syntax/runtime test;
- expected output assertion.

For TensorFlow.js model examples:

- TensorFlow.js version;
- input/output shape assertions;
- finite losses and metrics;
- training behaviour where training is claimed;
- held-out evaluation where model quality is claimed;
- tensor cleanup.

For browser examples:

- Playwright load test;
- no unexpected console errors;
- user-visible result assertion.

For persistence examples:

- save;
- reload;
- parity comparison.

For repeated inference:

- baseline tensor count;
- repeated predictions;
- stable post-run tensor count.

For datasets:

- class vocabulary;
- split boundaries;
- preprocessing contract;
- representative sample/label verification.

## Book/repository parity

Every substantial code listing in the book should map to a stable repository path or tagged revision. Readers should be able to reproduce the book result from the repository without access to the private Paper/Piri codebase.
