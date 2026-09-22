export function createClassifierHead(
  tf,
  embeddingSize,
  classCount,
) {
  if (!Number.isInteger(embeddingSize) || embeddingSize < 1) {
    throw new Error('embeddingSize must be a positive integer.');
  }

  if (!Number.isInteger(classCount) || classCount < 2) {
    throw new Error('classCount must be at least 2.');
  }

  const model = tf.sequential({
    name: 'transfer_classifier',
  });

  model.add(
    tf.layers.dense({
      inputShape: [embeddingSize],
      units: 100,
      activation: 'relu',
      kernelInitializer: 'varianceScaling',
      name: 'hidden',
    }),
  );

  model.add(
    tf.layers.dense({
      units: classCount,
      activation: 'softmax',
      kernelInitializer: 'varianceScaling',
      name: 'class_scores',
    }),
  );

  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}
