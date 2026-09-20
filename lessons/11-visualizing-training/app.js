function createTrainingData() {
  const xs = [];
  const labels = [];

  for (let classIndex = 0; classIndex < 10; classIndex += 1) {
    for (let example = 0; example < 8; example += 1) {
      const image = new Array(28 * 28).fill(0);
      const row = 2 + classIndex * 2;
      const col = 3 + (example % 4);

      for (let x = 0; x < 20; x += 1) {
        image[row * 28 + ((col + x) % 28)] = 1;
      }

      xs.push(image);
      labels.push(classIndex);
    }
  }

  const xTensor = tf.tensor4d(
    xs.flat(),
    [xs.length, 28, 28, 1],
  );
  const labelIds = tf.tensor1d(labels, 'int32');
  const yTensor = tf.oneHot(labelIds, 10);
  labelIds.dispose();

  return {xs: xTensor, ys: yTensor};
}

function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 4,
    kernelSize: 3,
    activation: 'relu',
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 10,
    activation: 'softmax',
  }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

async function main() {
  await tf.ready();

  const data = createTrainingData();
  const model = createModel();
  const chartContainer = document.querySelector('#charts');

  const metrics = ['loss', 'acc'];
  const fitCallbacks = tfvis.show.fitCallbacks(
    chartContainer,
    metrics,
    {
      callbacks: ['onEpochEnd'],
      zoomToFitAccuracy: true,
    },
  );

  document.querySelector('#status').textContent =
    'Training and drawing metrics…';

  const history = await model.fit(
    data.xs,
    data.ys,
    {
      epochs: 8,
      batchSize: 16,
      shuffle: true,
      verbose: 0,
      callbacks: fitCallbacks,
    },
  );

  const result = {
    tensorflowJs: tf.version.tfjs,
    tfjsVisLoaded: typeof tfvis !== 'undefined',
    epochCount: history.history.loss.length,
    loss: history.history.loss,
    accuracy: history.history.acc,
    chartSvgCount: chartContainer.querySelectorAll('svg').length,
    chartCanvasCount: chartContainer.querySelectorAll('canvas').length,
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent =
    'Training visualization complete';

  window.__LESSON_11_RESULT__ = result;

  data.xs.dispose();
  data.ys.dispose();
  model.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_11_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
