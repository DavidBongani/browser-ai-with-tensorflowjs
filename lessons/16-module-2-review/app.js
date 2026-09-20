import { QUESTIONS, scoreResponses } from './questions.js';

const form = document.querySelector('#quiz');

QUESTIONS.forEach((question, questionIndex) => {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');

  legend.textContent =
    (questionIndex + 1) + '. ' + question.prompt;

  fieldset.appendChild(legend);

  question.options.forEach((option, optionIndex) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    input.type = 'radio';
    input.name = 'question-' + questionIndex;
    input.value = String(optionIndex);

    label.append(input, ' ', option);
    fieldset.appendChild(label);
    fieldset.appendChild(document.createElement('br'));
  });

  form.appendChild(fieldset);
});

document.querySelector('#score').addEventListener('click', () => {
  const responses = QUESTIONS.map((_, index) => {
    const selected = document.querySelector(
      'input[name="question-' + index + '"]:checked',
    );

    return selected ? Number(selected.value) : -1;
  });

  const score = scoreResponses(responses);

  document.querySelector('#result').textContent =
    JSON.stringify(score, null, 2);

  window.__LESSON_16_RESULT__ = score;
});

window.__LESSON_16_READY__ = {
  questionCount: QUESTIONS.length,
};
