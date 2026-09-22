import { Dataset } from './dataset.js';
import { createClassifier } from './model.js';
import { trainClassifier } from './training.js';

const dataset = new Dataset(3);

[
  { classId: 0, featureValues: [1, 0, 0, 0] },
  { classId: 0, featureValues: [0.9, 0.1, 0, 0] },
  { classId: 1, featureValues: [0, 1, 0, 0] },
  { classId: 1, featureValues: [0.1, 0.9, 0, 0] },
  { classId: 2, featureValues: [0, 0, 1, 0] },
  { classId: 2, featureValues: [0, 0.1, 0.9, 0] },
].forEach(example => dataset.add(example));

const button = document.querySelector('#train');
const status = document.querySelector('#status');
const output = document.querySelector('#result');

button.addEventListener('click', async () => {
  button.disabled = true;

  let xs;
  let ys;
  let model;

  try {
    status.textContent =
      'Materializing captured examples…';

    ({ xs, ys } = dataset.toTensors(tf));

    model = createClassifier(
      tf,
      dataset.embeddingSize,
      dataset.classCount,
    );

    status.textContent =
      'Training classifier…';

    const training = await trainClassifier(
      model,
      xs,
      ys,
      {
        epochs: 60,
        batchSize: dataset.size,
        shuffle: false,
      },
    );

    const result = {
      datasetSize: dataset.size,
      counts: dataset.counts,
      xsShape: xs.shape,
      ysShape: ys.shape,
      ...training,
    };

    output.textContent =
      JSON.stringify(result, null, 2);

    status.textContent =
      'Training complete.';

    window.__LESSON_36_RESULT__ = result;
  } catch (error) {
    console.error(error);
    window.__LESSON_36_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    xs?.dispose();
    ys?.dispose();
    model?.dispose();
    button.disabled = false;
  }
});
