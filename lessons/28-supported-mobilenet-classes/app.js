import {
  classSummary,
  searchClasses,
} from './class-search.js';

const countElement = document.querySelector('#count');
const queryElement = document.querySelector('#query');
const resultsElement = document.querySelector('#results');

const summary = classSummary();

countElement.textContent =
  `MobileNet uses ${summary.count} ImageNet classes.`;

function render() {
  const matches = searchClasses(queryElement.value);

  resultsElement.innerHTML = matches
    .map(
      item =>
        '<li>' +
        item.classId +
        ': ' +
        item.className +
        '</li>',
    )
    .join('');

  window.__LESSON_28_RESULT__ = {
    summary,
    query: queryElement.value,
    matches,
  };
}

document
  .querySelector('#search')
  .addEventListener('click', render);

render();
