async function main() {
  await tf.ready();

  const model = await tf.loadLayersModel('./assets/model.json');
  const input = tf.tensor2d([[0], [1], [2]], [3, 1]);
  const prediction = model.predict(input);
  const values = Array.from(await prediction.data());

  const result = {
    tensorflowJs: tf.version.tfjs,
    modelLoaded: true,
    trainedInBrowser: false,
    inputs: [0, 1, 2],
    predictions: values,
    expectedRule: 'y = 2x + 1',
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent =
    'Pre-trained model loaded and inference complete';

  window.__LESSON_18_RESULT__ = result;

  input.dispose();
  prediction.dispose();
  model.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_18_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
