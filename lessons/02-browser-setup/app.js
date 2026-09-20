async function main() {
  await tf.ready();

  const runtime = {
    version: tf.version.tfjs,
    backend: tf.getBackend(),
  };

  document.querySelector('#runtime').textContent =
    JSON.stringify(runtime, null, 2);

  document.querySelector('#status').textContent =
    'TensorFlow.js is ready';

  window.__LESSON_02_RESULT__ = runtime;
}

main().catch(error => {
  console.error(error);
  window.__LESSON_02_ERROR__ =
    error instanceof Error
      ? error.message
      : String(error);
});
