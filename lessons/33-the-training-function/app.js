import {
  createTrainingModel,
  createTrainingTensors,
} from './model.js';
import { trainClassifier } from './training.js';

const button = document.querySelector('#train');
const status = document.querySelector('#status');
const output = document.querySelector('#result');

button.addEventListener('click', async () => {
  button.disabled = true;
  status.textContent = 'Training…';

  const model = createTrainingModel(tf);
  const { xs, ys } = createTrainingTensors(tf);

  try {
    const result = await trainClassifier(
      model,
      xs,
      ys,
      {
        epochs: 60,
        batchSize: 6,
        shuffle: false,
      },
    );

    output.textContent =
      JSON.stringify(result, null, 2);

    status.textContent = 'Training complete.';

    window.__LESSON_33_RESULT__ = result;
  } catch (error) {
    console.error(error);
    window.__LESSON_33_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    xs.dispose();
    ys.dispose();
    model.dispose();
    button.disabled = false;
  }
});
