async function main() {
  await tf.ready();

  let model;
  let input;
  let output;

  try {
    model = await tf.loadLayersModel(
      './web-model/model.json',
    );

    input = tf.tensor2d([[3, 4]], [1, 2]);
    output = model.predict(input);

    const [prediction] = await output.data();

    if (Math.abs(prediction - 2.5) > 1e-6) {
      throw new Error(
        'Converted model prediction mismatch: ' + prediction,
      );
    }

    document.querySelector('#prediction').textContent =
      prediction.toFixed(2);

    document.querySelector('#status').textContent =
      'Converted model loaded successfully';

    window.__LESSON_26_RESULT__ = {
      tensorflowJs: tf.version.tfjs,
      modelName: model.name,
      inputShape: model.inputs[0].shape,
      outputShape: model.outputs[0].shape,
      input: [3, 4],
      prediction,
    };
  } catch (error) {
    console.error(error);
    window.__LESSON_26_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    input?.dispose();
    output?.dispose();
    model?.dispose();
  }
}

main();
