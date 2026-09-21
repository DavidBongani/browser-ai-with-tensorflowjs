import {
  summarizePrediction,
} from './classifier-output.js';

const examples = [
  ['insult', [0.08, 0.92]],
  ['threat', [0.97, 0.03]],
  ['toxicity', [0.55, 0.45]],
];

function render() {
  const slider = document.querySelector('#threshold');
  const threshold = Number(slider.value);

  document.querySelector('#threshold-value').textContent =
    threshold.toFixed(2);

  const predictions = examples.map(
    ([label, probabilities]) =>
      summarizePrediction(
        label,
        probabilities,
        threshold,
      ),
  );

  document.querySelector('#results').innerHTML =
    predictions
      .map(prediction => `
        <section data-label="${prediction.label}">
          <h2>${prediction.label}</h2>
          <p>not-match probability: ${prediction.probabilities[0].toFixed(2)}</p>
          <p>match probability: ${prediction.probabilities[1].toFixed(2)}</p>
          <p>match: ${String(prediction.match)}</p>
        </section>
      `)
      .join('');

  window.__LESSON_19_RESULT__ = {
    threshold,
    predictions,
  };
}

document
  .querySelector('#threshold')
  .addEventListener('input', render);

render();
