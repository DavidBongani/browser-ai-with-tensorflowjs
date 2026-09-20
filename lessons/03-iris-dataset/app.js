import {
  IRIS_FEATURE_NAMES,
  parseIrisCsv,
  summarizeIris,
} from './iris.js';

async function main() {
  const response = await fetch(
    '../../shared/datasets/iris.csv',
  );

  if (!response.ok) {
    throw new Error(
      'Unable to load iris.csv',
    );
  }

  const text = await response.text();
  const { rows } = parseIrisCsv(text);
  const summary = summarizeIris(rows);

  const result = {
    features: IRIS_FEATURE_NAMES,
    ...summary,
    firstExample: rows[0],
  };

  document
    .querySelector('#summary')
    .textContent =
      JSON.stringify(result, null, 2);

  document
    .querySelector('#status')
    .textContent =
      'Dataset loaded';

  window.__LESSON_03_RESULT__ = result;
}

main().catch(error => {
  console.error(error);
  window.__LESSON_03_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
