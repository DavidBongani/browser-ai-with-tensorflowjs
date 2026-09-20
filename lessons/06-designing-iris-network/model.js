export function createIrisModel(tf) {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [4],
      units: 8,
      activation: 'relu',
    }),
  );

  model.add(
    tf.layers.dense({
      units: 3,
      activation: 'softmax',
    }),
  );

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export function describeIrisModel(model) {
  return {
    inputShape: model.inputs[0].shape,
    outputShape: model.outputs[0].shape,
    layers: model.layers.map(layer => {
      const config = layer.getConfig();

      return {
        name: layer.name,
        units: config.units,
        activation: config.activation,
      };
    }),
  };
}
