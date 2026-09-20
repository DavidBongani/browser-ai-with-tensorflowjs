# Lesson 9 — Breast Cancer Classification

This is the Module 1 programming assignment implementation.

Dataset:

- Breast Cancer Wisconsin (Diagnostic)
- 569 rows
- 30 numeric features
- binary diagnosis target: benign or malignant
- source and CC BY 4.0 attribution in `shared/datasets/README.md`

The implementation:

1. reads the CSV in the browser;
2. creates a stratified 80/20 split;
3. fits min/max scaling on training rows only;
4. trains a 30 → 16 → 8 → 1 classifier;
5. uses sigmoid + binary cross-entropy;
6. checks held-out accuracy;
7. performs benign and malignant inference.

The browser gate requires at least 90% held-out accuracy.
