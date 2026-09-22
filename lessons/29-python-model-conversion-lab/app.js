async function main() {
  await tf.ready();

  let model;
  let input;
  let output;

  try {
    const evidenceResponse = await fetch('./lab-evidence.json');
    if (!evidenceResponse.ok) {
      throw new Error('Unable to load lab evidence.');
    }

    const evidence = await evidenceResponse.json();

    model = await tf.loadLayersModel(
      './web-model/model.json',
    );

    input = tf.tensor2d(
      [evidence.input],
      [1, 2],
    );

    output = model.predict(input);
    const browserOutput = Array.from(
      await output.data(),
    );

    const maxDelta = Math.max(
      ...browserOutput.map(
        (value, index) =>
          Math.abs(value - evidence.pythonOutput[index]),
      ),
    );

    if (maxDelta > 1e-6) {
      throw new Error(
        'Python/browser output mismatch: ' + maxDelta,
      );
    }

    document.querySelector('#evidence').textContent =
      JSON.stringify(evidence, null, 2);

    document.querySelector('#prediction').textContent =
      JSON.stringify(browserOutput);

    document.querySelector('#status').textContent =
      'Converted lab model verified';

    window.__LESSON_29_RESULT__ = {
      tensorflowJs: tf.version.tfjs,
      modelName: model.name,
      input: evidence.input,
      pythonOutput: evidence.pythonOutput,
      browserOutput,
      maxDelta,
    };
  } catch (error) {
    console.error(error);
    window.__LESSON_29_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    input?.dispose();
    output?.dispose();
    model?.dispose();
  }
}

main();
