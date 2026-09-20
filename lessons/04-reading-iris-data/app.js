const IRIS_URL =
  '../../shared/datasets/iris.csv';

function createIrisDataset() {
  return tf.data.csv(
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
}

async function readDataset() {
  const dataset = createIrisDataset();
  const columnNames =
    await dataset.columnNames();

  const examples = [];

  await dataset.forEachAsync(
    example => {
      examples.push({
        xs: example.xs,
        ys: example.ys,
      });
    },
  );

  return {
    columnNames,
    examples,
  };
}

async function main() {
  await tf.ready();

  const {
    columnNames,
    examples,
  } = await readDataset();

  const result = {
    columnNames,
    exampleCount: examples.length,
    firstExample: examples[0],
    featureNames:
      Object.keys(examples[0].xs),
    labelNames:
      Object.keys(examples[0].ys),
  };

  document
    .querySelector('#output')
    .textContent =
      JSON.stringify(result, null, 2);

  document
    .querySelector('#status')
    .textContent =
      'Data loaded';

  window.__LESSON_04_RESULT__ = result;
}

main().catch(error => {
  console.error(error);
  window.__LESSON_04_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
