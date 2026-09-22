async function main() {
  await tf.ready();

  let model;
  let input;
  let output;

  try {
    const evidenceResponse = await fetch('./training-evidence.json');
    if (!evidenceResponse.ok) {
      throw new Error('Unable to load Python training evidence.');
    }

    const evidence = await evidenceResponse.json();

    model = await tf.loadLayersModel(
      './web-model/model.json',
    );

    input = tf.tensor2d([[4]], [1, 1]);
    output = model.predict(input);

    const [browserPrediction] = await output.data();
    const pythonPrediction = evidence.pythonPredictionAt4;
    const delta = Math.abs(
      browserPrediction - pythonPrediction,
    );

    if (delta > 1e-5) {
      throw new Error(
        'Python/browser prediction mismatch: ' + delta,
      );
    }

    document.querySelector('#evidence').textContent =
      JSON.stringify(evidence, null, 2);

    document.querySelector('#prediction').textContent =
      browserPrediction.toFixed(4);

    document.querySelector('#status').textContent =
      'Python and browser predictions agree';

    window.__LESSON_27_RESULT__ = {
      tensorflowJs: tf.version.tfjs,
      modelName: model.name,
      input: 4,
      browserPrediction,
      pythonPrediction,
      delta,
      learnedWeight: evidence.learnedWeight,
      learnedBias: evidence.learnedBias,
      finalLoss: evidence.finalLoss,
    };
  } catch (error) {
    console.error(error);
    window.__LESSON_27_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    input?.dispose();
    output?.dispose();
    model?.dispose();
  }
}

main();
