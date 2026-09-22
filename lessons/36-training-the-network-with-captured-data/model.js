export function createClassifier(
  tf,
  embeddingSize,
  classCount,
) {
  const model = tf.sequential({
    name: 'captured_data_classifier',
  });

  model.add(
    tf.layers.dense({
      inputShape: [embeddingSize],
      units: 8,
      activation: 'relu',
      kernelInitializer:
        tf.initializers.glorotUniform({ seed: 36 }),
      biasInitializer: 'zeros',
    }),
  );

  model.add(
    tf.layers.dense({
      units: classCount,
      activation: 'softmax',
      kernelInitializer:
        tf.initializers.glorotUniform({ seed: 37 }),
      biasInitializer: 'zeros',
    }),
  );

  model.compile({
    optimizer: tf.train.adam(0.05),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}
