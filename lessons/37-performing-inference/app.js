import { Dataset } from './dataset.js';
import { createClassifier } from './model.js';
import { trainClassifier } from './training.js';
import { classifyEmbedding } from './inference.js';

const CLASS_NAMES = [
  'square',
  'circle',
  'triangle',
];

const dataset = new Dataset(CLASS_NAMES.length);

[
  { classId: 0, featureValues: [1, 0, 0, 0] },
  { classId: 0, featureValues: [0.9, 0.1, 0, 0] },
  { classId: 1, featureValues: [0, 1, 0, 0] },
  { classId: 1, featureValues: [0.1, 0.9, 0, 0] },
  { classId: 2, featureValues: [0, 0, 1, 0] },
  { classId: 2, featureValues: [0, 0.1, 0.9, 0] },
].forEach(example => dataset.add(example));

const button = document.querySelector('#run');
const status = document.querySelector('#status');
const result = document.querySelector('#result');

button.addEventListener('click', async () => {
  button.disabled = true;

  let model;
  let xs;
  let ys;

  try {
    ({ xs, ys } = dataset.toTensors(tf));

    model = createClassifier(
      tf,
      dataset.embeddingSize,
      dataset.classCount,
    );

    const training = await trainClassifier(
      model,
      xs,
      ys,
      {
        epochs: 80,
        batchSize: dataset.size,
        shuffle: false,
      },
    );

    const prediction = await classifyEmbedding(
      tf,
      model,
      [0, 0.05, 0.95, 0],
      CLASS_NAMES,
    );

    const state = {
      training,
      prediction,
      classNames: CLASS_NAMES,
    };

    result.textContent =
      JSON.stringify(state, null, 2);

    status.textContent =
      `Prediction: ${prediction.className}`;

    window.__LESSON_37_RESULT__ = state;
  } catch (error) {
    console.error(error);
    window.__LESSON_37_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    xs?.dispose();
    ys?.dispose();
    model?.dispose();
    button.disabled = false;
  }
});
