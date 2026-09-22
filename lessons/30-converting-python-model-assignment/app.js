async function main() {
  await tf.ready();

  let model;
  let input;
  let output;

  try {
    const evidenceResponse = await fetch(
      './assignment-evidence.json',
    );

    if (!evidenceResponse.ok) {
      throw new Error('Unable to load assignment evidence.');
    }

    const evidence = await evidenceResponse.json();

    model = await tf.loadLayersModel(
      './web-model/model.json',
    );

    input = tf.tensor2d(
      evidence.checks,
      [evidence.checks.length, 2],
    );

    output = model.predict(input);

    const browserProbabilities = Array.from(
      await output.data(),
    );

    const browserLabels = browserProbabilities.map(
      probability => (probability >= 0.5 ? 1 : 0),
    );

    const maxDelta = Math.max(
      ...browserProbabilities.map(
        (value, index) =>
          Math.abs(
            value - evidence.pythonProbabilities[index],
          ),
      ),
    );

    if (maxDelta > 1e-5) {
      throw new Error(
        'Python/browser probability mismatch: ' + maxDelta,
      );
    }

    if (
      JSON.stringify(browserLabels) !==
      JSON.stringify(evidence.expectedLabels)
    ) {
      throw new Error(
        'Browser classification contract failed.',
      );
    }

    document.querySelector('#evidence').textContent =
      JSON.stringify(evidence, null, 2);

    document.querySelector('#predictions').textContent =
      JSON.stringify(
        {
          browserProbabilities,
          browserLabels,
        },
        null,
        2,
      );

    document.querySelector('#status').textContent =
      'Converted classifier verified';

    window.__LESSON_30_RESULT__ = {
      tensorflowJs: tf.version.tfjs,
      modelName: model.name,
      browserProbabilities,
      browserLabels,
      pythonProbabilities: evidence.pythonProbabilities,
      expectedLabels: evidence.expectedLabels,
      maxDelta,
      trainingAccuracy: evidence.trainingAccuracy,
    };
  } catch (error) {
    console.error(error);
    window.__LESSON_30_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    input?.dispose();
    output?.dispose();
    model?.dispose();
  }
}

main();
