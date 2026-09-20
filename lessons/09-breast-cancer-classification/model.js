export function createBreastCancerModel(tf) {
  const model =
    tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [30],
      units: 16,
      activation: 'relu',
      kernelInitializer:
        tf.initializers.glorotUniform({
          seed: 17,
        }),
    }),
  );

  model.add(
    tf.layers.dense({
      units: 8,
      activation: 'relu',
      kernelInitializer:
        tf.initializers.glorotUniform({
          seed: 23,
        }),
    }),
  );

  model.add(
    tf.layers.dense({
      units: 1,
      activation: 'sigmoid',
      kernelInitializer:
        tf.initializers.glorotUniform({
          seed: 31,
        }),
    }),
  );

  model.compile({
    optimizer:
      tf.train.adam(0.001),
    loss:
      'binaryCrossentropy',
    metrics:
      ['accuracy'],
  });

  return model;
}
