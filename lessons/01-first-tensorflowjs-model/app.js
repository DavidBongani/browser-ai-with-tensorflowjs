async function trainFirstModel() {
  await tf.ready();

  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [1],
    }),
  );

  model.compile({
    optimizer: tf.train.sgd(0.01),
    loss: 'meanSquaredError',
  });

  const xs = tf.tensor2d(
    [0, 1, 2, 3, 4, 5],
    [6, 1],
  );

  const ys = tf.tensor2d(
    [1, 3, 5, 7, 9, 11],
    [6, 1],
  );

  const history = await model.fit(
    xs,
    ys,
    {
      epochs: 250,
      shuffle: true,
      verbose: 0,
    },
  );

  const predictionTensor = model.predict(
    tf.tensor2d(
      [10],
      [1, 1],
    ),
  );

  const prediction =
    predictionTensor.dataSync()[0];

  const finalLoss =
    history.history.loss.at(-1);

  xs.dispose();
  ys.dispose();
  predictionTensor.dispose();

  return {
    model,
    prediction,
    finalLoss,
  };
}

async function main() {
  const status =
    document.querySelector('#status');

  const result =
    document.querySelector('#result');

  try {
    status.textContent =
      'Training model…';

    const output =
      await trainFirstModel();

    const summary = {
      tensorflowJs:
        tf.version.tfjs,
      backend:
        tf.getBackend(),
      predictedYFor10:
        output.prediction,
      expectedApproximately:
        21,
      finalLoss:
        output.finalLoss,
    };

    window.__LESSON_01_RESULT__ =
      summary;

    result.textContent =
      JSON.stringify(
        summary,
        null,
        2,
      );

    status.textContent =
      'Training complete';

    output.model.dispose();
  }
  catch (error) {
    console.error(error);

    window.__LESSON_01_ERROR__ =
      error instanceof Error
        ? error.message
        : String(error);

    status.textContent =
      'Training failed';
  }
}

main();
