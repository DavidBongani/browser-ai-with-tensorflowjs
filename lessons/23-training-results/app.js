import {
  rankPredictions,
  confidenceGap,
} from './results.js';

const samplePredictions = [
  { className: 'espresso', probability: 0.72 },
  { className: 'coffee mug', probability: 0.19 },
  { className: 'cup', probability: 0.06 },
];

const ranked = rankPredictions(samplePredictions);
const gap = confidenceGap(samplePredictions);

document.querySelector('#results').innerHTML =
  ranked
    .map(item =>
      '<li>' +
      item.className +
      ' — ' +
      item.percent.toFixed(1) +
      '%</li>',
    )
    .join('');

document.querySelector('#gap').textContent =
  'Top-two confidence gap: ' +
  (gap * 100).toFixed(1) +
  ' percentage points';

window.__LESSON_23_RESULT__ = {
  ranked,
  confidenceGap: gap,
};
