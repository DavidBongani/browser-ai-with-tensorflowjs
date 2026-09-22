export function createTrainingModel(tf) {
  const model = tf.sequential({
    name: 'training_function_demo',
  });

  model.add(
    tf.layers.dense({
      inputShape: [4],
      units: 8,
      activation: 'relu',
      kernelInitializer:
        tf.initializers.glorotUniform({ seed: 33 }),
      biasInitializer: 'zeros',
    }),
  );

  model.add(
    tf.layers.dense({
      units: 3,
      activation: 'softmax',
      kernelInitializer:
        tf.initializers.glorotUniform({ seed: 34 }),
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

export function createTrainingTensors(tf) {
  const xs = tf.tensor2d([
    [1, 0, 0, 0],
    [0.9, 0.1, 0, 0],
    [0, 1, 0, 0],
    [0.1, 0.9, 0, 0],
    [0, 0, 1, 0],
    [0, 0.1, 0.9, 0],
  ]);

  const ys = tf.tensor2d([
    [1, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 1],
  ]);

  return { xs, ys };
}
