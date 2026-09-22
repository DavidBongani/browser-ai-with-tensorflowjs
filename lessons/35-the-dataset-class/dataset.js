export class Dataset {
  constructor(classCount) {
    if (!Number.isInteger(classCount) || classCount < 2) {
      throw new Error(
        'classCount must be an integer of at least 2.',
      );
    }

    this.classCount = classCount;
    this.embeddingSize = null;
    this.examples = [];
  }

  get size() {
    return this.examples.length;
  }

  get counts() {
    const counts = Array(this.classCount).fill(0);

    for (const example of this.examples) {
      counts[example.classId] += 1;
    }

    return counts;
  }

  add(example) {
    if (
      !Number.isInteger(example?.classId) ||
      example.classId < 0 ||
      example.classId >= this.classCount
    ) {
      throw new Error('Invalid class id.');
    }

    if (
      !Array.isArray(example.featureValues) ||
      example.featureValues.length < 1 ||
      example.featureValues.some(
        value => !Number.isFinite(value),
      )
    ) {
      throw new Error(
        'featureValues must be a non-empty finite array.',
      );
    }

    const width = example.featureValues.length;

    if (this.embeddingSize === null) {
      this.embeddingSize = width;
    } else if (width !== this.embeddingSize) {
      throw new Error(
        'Every example must use the same embedding width.',
      );
    }

    this.examples.push({
      classId: example.classId,
      featureValues: [...example.featureValues],
    });

    return this;
  }

  canTrain() {
    return (
      this.size >= this.classCount &&
      this.counts.every(count => count > 0)
    );
  }

  toTensors(tf) {
    if (!this.canTrain()) {
      throw new Error(
        'At least one example is required for every class.',
      );
    }

    const xs = tf.tensor2d(
      this.examples.map(
        example => example.featureValues,
      ),
      [this.size, this.embeddingSize],
    );

    const labelIds = tf.tensor1d(
      this.examples.map(
        example => example.classId,
      ),
      'int32',
    );

    const ys = tf.oneHot(
      labelIds,
      this.classCount,
    );

    labelIds.dispose();

    return { xs, ys };
  }
}
