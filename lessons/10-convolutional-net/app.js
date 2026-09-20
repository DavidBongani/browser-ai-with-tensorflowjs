import {
  createMnistCnn,
  describeModel,
} from './model.js';

async function main() {
  await tf.ready();

  const model =
    createMnistCnn(tf);

  const layers =
    describeModel(model);

  const sample =
    tf.zeros(
      [1, 28, 28, 1],
    );

  const prediction =
    model.predict(sample);

  const result = {
    tensorflowJs:
      tf.version.tfjs,
    inputShape:
      model.inputs[0].shape,
    outputShape:
      model.outputs[0].shape,
    layers,
    predictionShape:
      prediction.shape,
  };

  document
    .querySelector('#output')
    .textContent =
      JSON.stringify(
        result,
        null,
        2,
      );

  document
    .querySelector('#status')
    .textContent =
      'CNN ready';

  window.__LESSON_10_RESULT__ =
    result;

  sample.dispose();
  prediction.dispose();
  model.dispose();
}

main().catch(error => {
  console.error(error);

  window.__LESSON_10_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
