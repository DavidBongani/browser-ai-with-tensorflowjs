import {
  FASHION_CLASSES,
  loadFashionMnist,
} from './fashion-loader.js';

import {
  createFashionModel,
} from './model.js';

const TRAIN_COUNT = 3000;
const TEST_COUNT = 500;

const TRAIN_IMAGES =
  '../../shared/datasets/fashion-mnist/train-images-idx3-ubyte.gz';
const TRAIN_LABELS =
  '../../shared/datasets/fashion-mnist/train-labels-idx1-ubyte.gz';
const TEST_IMAGES =
  '../../shared/datasets/fashion-mnist/t10k-images-idx3-ubyte.gz';
const TEST_LABELS =
  '../../shared/datasets/fashion-mnist/t10k-labels-idx1-ubyte.gz';

function argMax(values) {
  let best = 0;

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > values[best]) {
      best = index;
    }
  }

  return best;
}

function evaluate(model, xs, ys) {
  const raw = model.evaluate(xs, ys, {
    batchSize: 128,
    verbose: 0,
  });

  const tensors = Array.isArray(raw) ? raw : [raw];

  const result = {
    loss: tensors[0].dataSync()[0],
    accuracy: tensors[1].dataSync()[0],
  };

  tensors.forEach(tensor => tensor.dispose());

  return result;
}

function drawImage(canvas, values) {
  const context = canvas.getContext('2d');
  const image = context.createImageData(28, 28);

  for (let index = 0; index < 28 * 28; index += 1) {
    const value = Math.round(values[index] * 255);
    const offset = index * 4;
    image.data[offset] = value;
    image.data[offset + 1] = value;
    image.data[offset + 2] = value;
    image.data[offset + 3] = 255;
  }

  const tiny = document.createElement('canvas');
  tiny.width = 28;
  tiny.height = 28;
  tiny.getContext('2d').putImageData(image, 0, 0);

  context.imageSmoothingEnabled = false;
  context.drawImage(tiny, 0, 0, canvas.width, canvas.height);
}

async function main() {
  await tf.ready();

  const status = document.querySelector('#status');
  const chartContainer = document.querySelector('#charts');

  status.textContent = 'Loading Fashion-MNIST training data…';

  const train = await loadFashionMnist(tf, {
    imagesUrl: TRAIN_IMAGES,
    labelsUrl: TRAIN_LABELS,
    count: TRAIN_COUNT,
  });

  status.textContent = 'Loading Fashion-MNIST test data…';

  const test = await loadFashionMnist(tf, {
    imagesUrl: TEST_IMAGES,
    labelsUrl: TEST_LABELS,
    count: TEST_COUNT,
  });

  const model = createFashionModel(tf);

  const callbacks = tfvis.show.fitCallbacks(
    chartContainer,
    ['loss', 'acc'],
    {
      callbacks: ['onEpochEnd'],
      zoomToFitAccuracy: true,
    },
  );

  status.textContent = 'Training Fashion-MNIST classifier…';

  const history = await model.fit(
    train.xs,
    train.ys,
    {
      epochs: 5,
      batchSize: 128,
      shuffle: true,
      verbose: 0,
      callbacks,
    },
  );

  const metrics = evaluate(model, test.xs, test.ys);

  const firstInput = test.xs.slice(
    [0, 0, 0, 0],
    [1, 28, 28, 1],
  );

  const firstValues = Array.from(firstInput.dataSync());
  const firstPredictionTensor = model.predict(firstInput);
  const probabilities = Array.from(
    firstPredictionTensor.dataSync(),
  );

  const predictedClass = argMax(probabilities);
  const expectedClass = test.labels[0];

  firstInput.dispose();
  firstPredictionTensor.dispose();

  const canvas = document.querySelector('#sample');
  drawImage(canvas, firstValues);

  document.querySelector('#prediction').textContent =
    `Expected: ${FASHION_CLASSES[expectedClass]} — Predicted: ${FASHION_CLASSES[predictedClass]}`;

  const result = {
    tensorflowJs: tf.version.tfjs,
    trainingExamples: TRAIN_COUNT,
    heldOutExamples: TEST_COUNT,
    trainShape: train.xs.shape,
    trainLabelShape: train.ys.shape,
    testShape: test.xs.shape,
    epochs: history.history.loss.length,
    finalTrainingLoss: history.history.loss.at(-1),
    finalTrainingAccuracy: history.history.acc.at(-1),
    heldOutLoss: metrics.loss,
    heldOutAccuracy: metrics.accuracy,
    expectedClass,
    predictedClass,
    expectedName: FASHION_CLASSES[expectedClass],
    predictedName: FASHION_CLASSES[predictedClass],
    probabilitySum: probabilities.reduce(
      (sum, value) => sum + value,
      0,
    ),
    chartCount:
      chartContainer.querySelectorAll('svg, canvas').length,
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  status.textContent = 'Fashion-MNIST assignment complete';

  window.__LESSON_17_RESULT__ = result;

  train.xs.dispose();
  train.ys.dispose();
  test.xs.dispose();
  test.ys.dispose();
  model.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_17_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
