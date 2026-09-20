import {
  SPECIES,
  labelsToIndices,
} from '../05-one-hot-encoding/encoding.js';

const IRIS_URL =
  '../../shared/datasets/iris.csv';

async function loadExamples() {
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

  const examples = [];

  await dataset.forEachAsync(
    ({ xs, ys }) => {
      examples.push({
        features: [
          xs.sepal_length,
          xs.sepal_width,
          xs.petal_length,
          xs.petal_width,
        ],
        label: ys.species,
      });
    },
  );

  return examples;
}

function splitByClass(
  examples,
  trainPerClass = 40,
) {
  const train = [];
  const test = [];

  for (const species of SPECIES) {
    const group = examples.filter(
      example =>
        example.label === species,
    );

    train.push(
      ...group.slice(
        0,
        trainPerClass,
      ),
    );

    test.push(
      ...group.slice(
        trainPerClass,
      ),
    );
  }

  return {
    train,
    test,
  };
}

function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [4],
      units: 8,
      activation: 'relu',
      kernelInitializer:
        tf.initializers.glorotUniform({
          seed: 11,
        }),
    }),
  );

  model.add(
    tf.layers.dense({
      units: 3,
      activation: 'softmax',
      kernelInitializer:
        tf.initializers.glorotUniform({
          seed: 29,
        }),
    }),
  );

  model.compile({
    optimizer:
      tf.train.adam(0.01),
    loss:
      'categoricalCrossentropy',
    metrics:
      ['accuracy'],
  });

  return model;
}

function toTrainingTensors(
  examples,
) {
  const xs = tf.tensor2d(
    examples.map(
      example =>
        example.features,
    ),
    [
      examples.length,
      4,
    ],
  );

  const labelIds =
    tf.tensor1d(
      labelsToIndices(
        examples.map(
          example =>
            example.label,
        ),
      ),
      'int32',
    );

  const ys = tf.oneHot(
    labelIds,
    SPECIES.length,
  );

  labelIds.dispose();

  return {
    xs,
    ys,
  };
}

async function evaluateModel(
  model,
  test,
) {
  const testTensors =
    toTrainingTensors(test);

  const result =
    model.evaluate(
      testTensors.xs,
      testTensors.ys,
      {
        verbose: 0,
      },
    );

  const tensors =
    Array.isArray(result)
      ? result
      : [result];

  const loss =
    tensors[0].dataSync()[0];

  const accuracy =
    tensors[1].dataSync()[0];

  tensors.forEach(
    tensor =>
      tensor.dispose(),
  );

  testTensors.xs.dispose();
  testTensors.ys.dispose();

  return {
    loss,
    accuracy,
  };
}

function predictSpecies(
  model,
  features,
) {
  return tf.tidy(() => {
    const input =
      tf.tensor2d(
        [features],
        [1, 4],
      );

    const output =
      model.predict(input);

    const probabilities =
      Array.from(
        output.dataSync(),
      );

    const classIndex =
      probabilities.indexOf(
        Math.max(
          ...probabilities,
        ),
      );

    return {
      classIndex,
      species:
        SPECIES[classIndex],
      probabilities,
    };
  });
}

async function main() {
  await tf.ready();

  const examples =
    await loadExamples();

  const {
    train,
    test,
  } = splitByClass(
    examples,
  );

  const trainTensors =
    toTrainingTensors(train);

  const model =
    createModel();

  document
    .querySelector('#status')
    .textContent =
      'Training classifier…';

  const history =
    await model.fit(
      trainTensors.xs,
      trainTensors.ys,
      {
        epochs: 160,
        batchSize: 16,
        shuffle: true,
        verbose: 0,
      },
    );

  const metrics =
    await evaluateModel(
      model,
      test,
    );

  const samplePrediction =
    predictSpecies(
      model,
      [5.1, 3.5, 1.4, 0.2],
    );

  const result = {
    tensorflowJs:
      tf.version.tfjs,
    trainingExamples:
      train.length,
    heldOutExamples:
      test.length,
    finalTrainingLoss:
      history.history.loss.at(-1),
    heldOutLoss:
      metrics.loss,
    heldOutAccuracy:
      metrics.accuracy,
    samplePrediction,
  };

  document
    .querySelector('#output')
    .textContent =
      JSON.stringify(
        result,
        null,
        2,
      );

  document
    .querySelector('#status')
    .textContent =
      'Training complete';

  window.__LESSON_07_RESULT__ =
    result;

  trainTensors.xs.dispose();
  trainTensors.ys.dispose();
  model.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_07_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
