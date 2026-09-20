function createTemporaryImageWork() {
  const image = tf.randomUniform([28, 28, 1], 0, 255);
  const normalized = image.div(255);
  const batched = normalized.reshape([1, 28, 28, 1]);
  const summary = batched.mean();

  return {
    image,
    normalized,
    batched,
    summary,
  };
}

function runTidyImageWork() {
  return tf.tidy(() => {
    const image = tf.randomUniform([28, 28, 1], 0, 255);
    const normalized = image.div(255);
    const batched = normalized.reshape([1, 28, 28, 1]);
    return batched.mean().dataSync()[0];
  });
}

async function main() {
  await tf.ready();

  const baseline = tf.memory().numTensors;
  const leaked = [];

  for (let index = 0; index < 20; index += 1) {
    const work = createTemporaryImageWork();
    leaked.push(
      work.image,
      work.normalized,
      work.batched,
      work.summary,
    );
  }

  const afterTemporaryAccumulation =
    tf.memory().numTensors;

  leaked.forEach(tensor => tensor.dispose());

  const afterManualCleanup =
    tf.memory().numTensors;

  const tidyCounts = [];

  for (let index = 0; index < 100; index += 1) {
    runTidyImageWork();
    tidyCounts.push(tf.memory().numTensors);
  }

  const afterTidyLoop =
    tf.memory().numTensors;

  const result = {
    tensorflowJs: tf.version.tfjs,
    baseline,
    afterTemporaryAccumulation,
    afterManualCleanup,
    afterTidyLoop,
    temporaryIncrease:
      afterTemporaryAccumulation - baseline,
    tidyStable:
      tidyCounts.every(
        count => count === afterManualCleanup,
      ),
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent =
    'Memory experiment complete';

  window.__LESSON_14_RESULT__ = result;
}

main().catch(error => {
  console.error(error);
  window.__LESSON_14_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
