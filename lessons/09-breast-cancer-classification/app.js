import {
  fitMinMax,
  parseBreastCancerCsv,
  scaleFeatures,
  stratifiedSplit,
} from './data.js';

import {
  createBreastCancerModel,
} from './model.js';

const DATA_URL =
  '../../shared/datasets/wdbc.csv';

function tensorsFromRows(
  rows,
  scaler,
) {
  const xs =
    tf.tensor2d(
      rows.map(
        row =>
          scaleFeatures(
            row.features,
            scaler,
          ),
      ),
      [
        rows.length,
        30,
      ],
    );

  const ys =
    tf.tensor2d(
      rows.map(
        row => [
          row.target,
        ],
      ),
      [
        rows.length,
        1,
      ],
    );

  return {
    xs,
    ys,
  };
}

async function evaluateBinary(
  model,
  rows,
  scaler,
) {
  const tensors =
    tensorsFromRows(
      rows,
      scaler,
    );

  const raw =
    model.evaluate(
      tensors.xs,
      tensors.ys,
      {
        verbose: 0,
      },
    );

  const outputs =
    Array.isArray(raw)
      ? raw
      : [raw];

  const result = {
    loss:
      outputs[0]
        .dataSync()[0],

    accuracy:
      outputs[1]
        .dataSync()[0],
  };

  outputs.forEach(
    tensor =>
      tensor.dispose(),
  );

  tensors.xs.dispose();
  tensors.ys.dispose();

  return result;
}

function predictDiagnosis(
  model,
  features,
  scaler,
) {
  return tf.tidy(() => {
    const scaled =
      scaleFeatures(
        features,
        scaler,
      );

    const input =
      tf.tensor2d(
        [scaled],
        [1, 30],
      );

    const output =
      model.predict(input);

    const probability =
      output.dataSync()[0];

    return {
      malignantProbability:
        probability,
      predictedDiagnosis:
        probability >= 0.5
          ? 'M'
          : 'B',
    };
  });
}

async function main() {
  await tf.ready();

  const response =
    await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(
      'Unable to load wdbc.csv',
    );
  }

  const text =
    await response.text();

  const {
    featureNames,
    rows,
  } =
    parseBreastCancerCsv(
      text,
    );

  const {
    train,
    test,
  } =
    stratifiedSplit(
      rows,
      0.8,
    );

  const scaler =
    fitMinMax(
      train,
    );

  const training =
    tensorsFromRows(
      train,
      scaler,
    );

  const model =
    createBreastCancerModel(
      tf,
    );

  document
    .querySelector('#status')
    .textContent =
      'Training classifier…';

  const history =
    await model.fit(
      training.xs,
      training.ys,
      {
        epochs: 90,
        batchSize: 32,
        shuffle: true,
        validationSplit: 0.1,
        verbose: 0,
      },
    );

  const heldOut =
    await evaluateBinary(
      model,
      test,
      scaler,
    );

  const benignSample =
    rows.find(
      row =>
        row.target === 0,
    );

  const malignantSample =
    rows.find(
      row =>
        row.target === 1,
    );

  const result = {
    tensorflowJs:
      tf.version.tfjs,
    rowCount:
      rows.length,
    featureCount:
      featureNames.length,
    trainingExamples:
      train.length,
    heldOutExamples:
      test.length,
    finalTrainingLoss:
      history.history.loss.at(-1),
    heldOutLoss:
      heldOut.loss,
    heldOutAccuracy:
      heldOut.accuracy,
    benignPrediction:
      predictDiagnosis(
        model,
        benignSample.features,
        scaler,
      ),
    malignantPrediction:
      predictDiagnosis(
        model,
        malignantSample.features,
        scaler,
      ),
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

  window.__LESSON_09_RESULT__ =
    result;

  training.xs.dispose();
  training.ys.dispose();
  model.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_09_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
