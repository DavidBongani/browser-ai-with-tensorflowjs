import {
  SPECIES,
  labelsToIndices,
} from './encoding.js';

const IRIS_URL =
  '../../shared/datasets/iris.csv';

async function loadLabels() {
  const dataset = tf.data.csv(
    IRIS_URL,
    {
      columnConfigs: {
        species: {
          isLabel: true,
          dtype: 'string',
        },
      },
    },
  );

  const labels = [];

  await dataset.forEachAsync(
    ({ ys }) => {
      labels.push(
        ys.species,
      );
    },
  );

  return labels;
}

async function main() {
  await tf.ready();

  const labels =
    await loadLabels();

  const indices =
    labelsToIndices(labels);

  const indexTensor =
    tf.tensor1d(
      indices,
      'int32',
    );

  const encodedTensor =
    tf.oneHot(
      indexTensor,
      SPECIES.length,
    );

  const encoded =
    await encodedTensor.array();

  const rowSums =
    Array.from(
      encodedTensor
        .sum(1)
        .dataSync(),
    );

  const result = {
    classOrder: SPECIES,
    labelCount: labels.length,
    shape: encodedTensor.shape,
    examples: {
      setosa: encoded[0],
      versicolor: encoded[50],
      virginica: encoded[100],
    },
    everyRowHasOneActiveClass:
      rowSums.every(
        value => value === 1,
      ),
  };

  document
    .querySelector('#output')
    .textContent =
      JSON.stringify(result, null, 2);

  document
    .querySelector('#status')
    .textContent =
      'Labels encoded';

  window.__LESSON_05_RESULT__ =
    result;

  indexTensor.dispose();
  encodedTensor.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_05_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
