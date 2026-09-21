let model;

function drawSample() {
  const canvas = document.querySelector('#sample');
  const context = canvas.getContext('2d');
  context.fillStyle = '#f2f2f2';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#222';
  context.fillRect(52, 72, 120, 80);
  context.fillStyle = '#777';
  context.beginPath();
  context.arc(112, 112, 34, 0, Math.PI * 2);
  context.fill();
  return canvas;
}

async function loadModel() {
  await tf.ready();
  model = await mobilenet.load({ version: 2, alpha: 1.0 });
  drawSample();
  document.querySelector('#status').textContent = 'MobileNet ready';
  window.__LESSON_22_READY__ = true;
}

async function classifySample() {
  const canvas = drawSample();
  const predictions = await model.classify(canvas, 3);

  const result = {
    tensorflowJs: tf.version.tfjs,
    modelVersion: 2,
    alpha: 1,
    predictions,
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent =
    'Classification complete';
  window.__LESSON_22_RESULT__ = result;
}

document.querySelector('#classify').addEventListener('click', () => {
  classifySample().catch(error => {
    console.error(error);
    window.__LESSON_22_ERROR__ = String(error);
  });
});

loadModel().catch(error => {
  console.error(error);
  window.__LESSON_22_ERROR__ = String(error);
});
