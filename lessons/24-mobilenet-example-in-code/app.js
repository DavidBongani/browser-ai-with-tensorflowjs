function drawImage() {
  const canvas = document.querySelector('#image');
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, 224, 224);
  ctx.fillStyle = '#5a351d';
  ctx.fillRect(48, 76, 128, 92);
  ctx.fillStyle = '#e8e8e8';
  ctx.beginPath();
  ctx.arc(112, 116, 42, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

async function main() {
  await tf.ready();

  const image = drawImage();
  const model = await mobilenet.load({
    version: 2,
    alpha: 1,
  });

  const predictions =
    await model.classify(image, 3);

  document.querySelector('#output').innerHTML =
    predictions
      .map(prediction =>
        '<li>' +
        prediction.className +
        ' : ' +
        prediction.probability.toFixed(6) +
        '</li>',
      )
      .join('');

  document.querySelector('#status').textContent =
    'Top 3 predictions';

  window.__LESSON_24_RESULT__ = {
    tensorflowJs: tf.version.tfjs,
    predictions,
    renderedCount:
      document.querySelectorAll('#output li').length,
  };
}

main().catch(error => {
  console.error(error);
  window.__LESSON_24_ERROR__ = String(error);
});
