export async function classifyEmbedding(
  tf,
  model,
  featureValues,
  classNames,
) {
  const expectedWidth = model.inputs[0].shape[1];

  if (
    !Array.isArray(featureValues) ||
    featureValues.length !== expectedWidth
  ) {
    throw new Error(
      `Expected ${expectedWidth} embedding values.`,
    );
  }

  if (
    !Array.isArray(classNames) ||
    classNames.length !== model.outputs[0].shape[1]
  ) {
    throw new Error(
      'classNames must match the classifier output width.',
    );
  }

  const input = tf.tensor2d(
    [featureValues],
    [1, expectedWidth],
  );

  let output;

  try {
    output = model.predict(input);

    const scores = Array.from(
      await output.data(),
    );

    const confidence = Math.max(...scores);
    const classId = scores.indexOf(confidence);

    return {
      classId,
      className: classNames[classId],
      confidence,
      scores,
    };
  } finally {
    input.dispose();
    output?.dispose();
  }
}
