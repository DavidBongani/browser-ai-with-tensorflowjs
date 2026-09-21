import {
  loadMnistSlice,
  oneHotArgMax,
} from '../13-using-the-sprite-sheet/mnist-loader.js';

import {
  createMnistModel,
} from './model.js';

const TRAIN_COUNT = 3000;
const TEST_START = 55000;
const TEST_COUNT = 500;

function getEvaluationMetrics(result) {
  const values = Array.isArray(result) ? result : [result];

  const metrics = {
    loss: values[0].dataSync()[0],
    accuracy: values[1].dataSync()[0],
  };

  values.forEach(tensor => tensor.dispose());

  return metrics;
}

function clearCanvas(canvas) {
  const context = canvas.getContext('2d');
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function setupDrawing(canvas) {
  const context = canvas.getContext('2d');

  clearCanvas(canvas);

  context.strokeStyle = 'white';
  context.lineWidth = 20;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  let drawing = false;

  function position(event) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
  }

  canvas.addEventListener('pointerdown', event => {
    drawing = true;
    const point = position(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', event => {
    if (!drawing) return;
    const point = position(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  });

  function stopDrawing() {
    drawing = false;
  }

  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);
}

function renderExampleToCanvas(canvas, imageValues) {
  const context = canvas.getContext('2d');
  clearCanvas(canvas);

  const scale = canvas.width / 28;

  for (let row = 0; row < 28; row += 1) {
    for (let column = 0; column < 28; column += 1) {
      const value = Math.round(
        imageValues[row * 28 + column] * 255,
      );

      if (value === 0) continue;

      context.fillStyle =
        `rgb(${value}, ${value}, ${value})`;

      context.fillRect(
        column * scale,
        row * scale,
        scale,
        scale,
      );
    }
  }
}

function classifyCanvas(model, canvas) {
  return tf.tidy(() => {
    const pixels = tf.browser
      .fromPixels(canvas, 1)
      .toFloat()
      .div(255);

    const resized = tf.image.resizeBilinear(
      pixels,
      [28, 28],
      false,
    );

    const input = resized.reshape(
      [1, 28, 28, 1],
    );

    const output = model.predict(input);
    const probabilities = Array.from(
      output.dataSync(),
    );

    return {
      classIndex: oneHotArgMax(probabilities),
      probabilities,
    };
  });
}

async function main() {
  await tf.ready();

  const status = document.querySelector('#status');
  const canvas = document.querySelector('#draw');
  const classifyButton = document.querySelector('#classify');
  const clearButton = document.querySelector('#clear');
  const predictionElement = document.querySelector('#prediction');
  const chartContainer = document.querySelector('#charts');

  setupDrawing(canvas);

  status.textContent = 'Loading training images…';

  const trainData = await loadMnistSlice(
    tf,
    {
      start: 0,
      count: TRAIN_COUNT,
      chunkRows: 500,
    },
  );

  status.textContent = 'Loading held-out images…';

  const testData = await loadMnistSlice(
    tf,
    {
      start: TEST_START,
      count: TEST_COUNT,
      chunkRows: 500,
    },
  );

  const model = createMnistModel(tf);

  const callbacks = tfvis.show.fitCallbacks(
    chartContainer,
    ['loss', 'acc'],
    {
      callbacks: ['onEpochEnd'],
      zoomToFitAccuracy: true,
    },
  );

  status.textContent = 'Training MNIST classifier…';

  const history = await model.fit(
    trainData.xs,
    trainData.ys,
    {
      epochs: 3,
      batchSize: 128,
      shuffle: false,
      verbose: 0,
      callbacks,
    },
  );

  const evaluation = getEvaluationMetrics(
    model.evaluate(
      testData.xs,
      testData.ys,
      {
        batchSize: 128,
        verbose: 0,
      },
    ),
  );

  const firstImageTensor = testData.xs.slice(
    [0, 0, 0, 0],
    [1, 28, 28, 1],
  );

  const firstLabelTensor = testData.ys.slice(
    [0, 0],
    [1, 10],
  );

  const firstImage = Array.from(
    firstImageTensor.dataSync(),
  );

  const expectedClass = oneHotArgMax(
    Array.from(
      firstLabelTensor.dataSync(),
    ),
  );

  firstImageTensor.dispose();
  firstLabelTensor.dispose();

  renderExampleToCanvas(
    canvas,
    firstImage,
  );

  const canvasPrediction = classifyCanvas(
    model,
    canvas,
  );

  const memoryBeforeRepeatedInference =
    tf.memory().numTensors;

  for (let index = 0; index < 20; index += 1) {
    classifyCanvas(model, canvas);
  }

  const memoryAfterRepeatedInference =
    tf.memory().numTensors;

  function classifyCurrentDrawing() {
    const prediction = classifyCanvas(
      model,
      canvas,
    );

    predictionElement.textContent =
      `Prediction: ${prediction.classIndex}`;

    return prediction;
  }

  classifyButton.disabled = false;
  clearButton.disabled = false;

  classifyButton.addEventListener(
    'click',
    classifyCurrentDrawing,
  );

  clearButton.addEventListener(
    'click',
    () => {
      clearCanvas(canvas);
      predictionElement.textContent = '';
    },
  );

  const result = {
    tensorflowJs: tf.version.tfjs,
    trainingExamples: TRAIN_COUNT,
    heldOutExamples: TEST_COUNT,
    epochs: history.history.loss.length,
    finalTrainingLoss: history.history.loss.at(-1),
    finalTrainingAccuracy: history.history.acc.at(-1),
    heldOutLoss: evaluation.loss,
    heldOutAccuracy: evaluation.accuracy,
    expectedCanvasClass: expectedClass,
    canvasPrediction: canvasPrediction.classIndex,
    canvasProbabilitySum:
      canvasPrediction.probabilities.reduce(
        (sum, value) => sum + value,
        0,
      ),
    memoryBeforeRepeatedInference,
    memoryAfterRepeatedInference,
    chartCount:
      chartContainer.querySelectorAll('svg, canvas').length,
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);

  predictionElement.textContent =
    `Loaded test digit: expected ${expectedClass}, predicted ${canvasPrediction.classIndex}`;

  status.textContent =
    'MNIST classifier ready — clear the canvas and draw your own digit';

  window.__LESSON_15_RESULT__ = result;
  window.__LESSON_15_MODEL__ = model;

  trainData.xs.dispose();
  trainData.ys.dispose();
  testData.xs.dispose();
  testData.ys.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_15_ERROR__ =
    error instanceof Error ? error.message : String(error);
});

