import {
  compareConvolutions,
} from './mobilenet-math.js';

function readPositiveInteger(selector) {
  const value = Number(
    document.querySelector(selector).value,
  );

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('Values must be positive integers.');
  }

  return value;
}

function render() {
  const kernelSize =
    readPositiveInteger('#kernel');
  const inputChannels =
    readPositiveInteger('#input-channels');
  const outputChannels =
    readPositiveInteger('#output-channels');

  const comparison = compareConvolutions(
    kernelSize,
    inputChannels,
    outputChannels,
  );

  const result = {
    kernelSize,
    inputChannels,
    outputChannels,
    ...comparison,
    parameterReductionPercent:
      comparison.reduction * 100,
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);

  window.__LESSON_21_RESULT__ = result;
}

document
  .querySelector('#compare')
  .addEventListener('click', render);

render();
