# Lesson 5 — One-Hot Encoding

This lesson converts the three Iris species into fixed three-element target vectors.

Class order:

```text
0 → Iris-setosa
1 → Iris-versicolor
2 → Iris-virginica
```

One-hot targets:

```text
Iris-setosa      → [1, 0, 0]
Iris-versicolor  → [0, 1, 0]
Iris-virginica   → [0, 0, 1]
```

The browser test verifies all 150 labels are encoded to shape `[150, 3]`.
