import { Dataset } from './dataset.js';

const dataset = new Dataset(3);

const examples = [
  { classId: 0, featureValues: [1, 0, 0, 0] },
  { classId: 0, featureValues: [0.9, 0.1, 0, 0] },
  { classId: 1, featureValues: [0, 1, 0, 0] },
  { classId: 1, featureValues: [0.1, 0.9, 0, 0] },
  { classId: 2, featureValues: [0, 0, 1, 0] },
  { classId: 2, featureValues: [0, 0.1, 0.9, 0] },
];

for (const example of examples) {
  dataset.add(example);
}

const button = document.querySelector('#build');
const status = document.querySelector('#status');
const result = document.querySelector('#result');

button.addEventListener('click', () => {
  let xs;
  let ys;

  try {
    ({ xs, ys } = dataset.toTensors(tf));

    const output = {
      size: dataset.size,
      counts: dataset.counts,
      embeddingSize: dataset.embeddingSize,
      canTrain: dataset.canTrain(),
      xsShape: xs.shape,
      ysShape: ys.shape,
    };

    result.textContent =
      JSON.stringify(output, null, 2);

    status.textContent =
      'Training tensors are ready.';

    window.__LESSON_35_RESULT__ = output;
  } catch (error) {
    console.error(error);
    window.__LESSON_35_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    xs?.dispose();
    ys?.dispose();
  }
});

window.__LESSON_35_DATASET__ = {
  size: dataset.size,
  counts: dataset.counts,
  embeddingSize: dataset.embeddingSize,
  canTrain: dataset.canTrain(),
};
