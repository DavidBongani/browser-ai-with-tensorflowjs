import {
  createIrisModel,
  describeIrisModel,
} from './model.js';

async function main() {
  await tf.ready();

  const model = createIrisModel(tf);
  const description =
    describeIrisModel(model);

  document
    .querySelector('#output')
    .textContent =
      JSON.stringify(
        description,
        null,
        2,
      );

  document
    .querySelector('#status')
    .textContent =
      'Model ready';

  window.__LESSON_06_RESULT__ =
    description;

  model.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_06_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
