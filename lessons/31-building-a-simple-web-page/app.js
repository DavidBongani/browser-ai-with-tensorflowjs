import {
  addExample,
  canTrain,
  createPageState,
  markTrained,
} from './page-state.js';

const state = createPageState(3);

const status = document.querySelector('#status');
const counts = document.querySelector('#counts');
const trainButton = document.querySelector('#train');
const predictButton = document.querySelector('#predict');
const prediction = document.querySelector('#prediction');

function render() {
  counts.textContent = state.counts.join(' / ');
  trainButton.disabled = !canTrain(state);
  predictButton.disabled = !state.trained;
}

document.querySelector('#start-camera')
  .addEventListener('click', () => {
    state.cameraReady = true;
    status.textContent =
      'Camera surface is ready for the next lesson.';
    render();
  });

document.querySelectorAll('[data-class-id]')
  .forEach(button => {
    button.addEventListener('click', () => {
      addExample(
        state,
        Number(button.dataset.classId),
      );
      status.textContent = 'Example count updated.';
      render();
    });
  });

trainButton.addEventListener('click', () => {
  markTrained(state);
  status.textContent =
    'Training controls are ready for the next lessons.';
  render();
});

predictButton.addEventListener('click', () => {
  prediction.textContent =
    'Prediction controls are connected.';
});

render();

window.__LESSON_31_STATE__ = state;
