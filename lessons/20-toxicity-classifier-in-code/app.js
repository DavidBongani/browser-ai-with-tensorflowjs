const threshold = 0.9;
let model;

async function loadModel() {
  await tf.ready();
  model = await toxicity.load(threshold);
  document.querySelector('#status').textContent = 'Model ready';
  window.__LESSON_20_READY__ = true;
}

async function classifyCurrentText() {
  const text = document.querySelector('#text').value.trim();
  if (!text) return;

  document.querySelector('#status').textContent = 'Classifying…';

  const predictions = await model.classify([text]);
  const result = {
    tensorflowJs: tf.version.tfjs,
    threshold,
    text,
    labels: predictions.map(item => item.label),
    predictions: predictions.map(item => ({
      label: item.label,
      match: item.results[0].match,
      probabilities: Array.from(item.results[0].probabilities),
    })),
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent = 'Classification complete';
  window.__LESSON_20_RESULT__ = result;
}

document
  .querySelector('#classify')
  .addEventListener('click', () => {
    classifyCurrentText().catch(error => {
      console.error(error);
      window.__LESSON_20_ERROR__ =
        error instanceof Error ? error.message : String(error);
    });
  });

loadModel().catch(error => {
  console.error(error);
  window.__LESSON_20_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
