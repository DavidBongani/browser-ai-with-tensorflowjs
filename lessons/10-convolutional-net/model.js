export function createMnistCnn(tf) {
  const model =
    tf.sequential();

  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 1],
      filters: 8,
      kernelSize: 5,
      activation: 'relu',
      kernelInitializer:
        'varianceScaling',
    }),
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    }),
  );

  model.add(
    tf.layers.conv2d({
      filters: 16,
      kernelSize: 5,
      activation: 'relu',
      kernelInitializer:
        'varianceScaling',
    }),
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    }),
  );

  model.add(
    tf.layers.flatten(),
  );

  model.add(
    tf.layers.dense({
      units: 10,
      activation: 'softmax',
    }),
  );

  model.compile({
    optimizer:
      tf.train.adam(),
    loss:
      'categoricalCrossentropy',
    metrics:
      ['accuracy'],
  });

  return model;
}

export function describeModel(model) {
  return model.layers.map(
    layer => ({
      name:
        layer.getClassName(),
      outputShape:
        layer.outputShape,
      parameterCount:
        layer.countParams(),
      config:
        {
          filters:
            layer.getConfig()
              .filters
            ?? null,
          kernelSize:
            layer.getConfig()
              .kernelSize
            ?? null,
          units:
            layer.getConfig()
              .units
            ?? null,
          activation:
            layer.getConfig()
              .activation
            ?? null,
        },
    }),
  );
}
