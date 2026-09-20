export function createMnistModel(tf) {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 8,
    kernelSize: 5,
    activation: 'relu',
    kernelInitializer: tf.initializers.varianceScaling({
      scale: 1,
      mode: 'fanAvg',
      distribution: 'uniform',
      seed: 41,
    }),
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2],
  }));

  model.add(tf.layers.conv2d({
    filters: 16,
    kernelSize: 5,
    activation: 'relu',
    kernelInitializer: tf.initializers.varianceScaling({
      scale: 1,
      mode: 'fanAvg',
      distribution: 'uniform',
      seed: 43,
    }),
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2],
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 10,
    activation: 'softmax',
    kernelInitializer: tf.initializers.varianceScaling({
      scale: 1,
      mode: 'fanAvg',
      distribution: 'uniform',
      seed: 47,
    }),
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}
