import { createClassifierHead } from './classifier-head.js';

function drawSample() {
  const canvas = document.querySelector('#sample');
  const context = canvas.getContext('2d');

  context.fillStyle = '#f2f2f2';
  context.fillRect(0, 0, 224, 224);
  context.fillStyle = '#444';
  context.fillRect(48, 48, 128, 128);
  context.fillStyle = '#ddd';
  context.beginPath();
  context.arc(112, 112, 42, 0, Math.PI * 2);
  context.fill();

  return canvas;
}

async function main() {
  await tf.ready();

  let embedding;
  let classifier;

  try {
    const featureExtractor = await mobilenet.load({
      version: 2,
      alpha: 1,
    });

    const sample = drawSample();

    embedding = featureExtractor.infer(
      sample,
      true,
    );

    const embeddingSize = embedding.shape[1];

    classifier = createClassifierHead(
      tf,
      embeddingSize,
      3,
    );

    const result = {
      tensorflowJs: tf.version.tfjs,
      embeddingShape: embedding.shape,
      embeddingSize,
      classifierInputShape:
        classifier.inputs[0].shape,
      classifierOutputShape:
        classifier.outputs[0].shape,
      classifierName: classifier.name,
      classCount: 3,
    };

    document.querySelector('#status').textContent =
      'MobileNet embedding is ready for transfer learning.';

    document.querySelector('#output').textContent =
      JSON.stringify(result, null, 2);

    window.__LESSON_32_RESULT__ = result;
  } catch (error) {
    console.error(error);
    window.__LESSON_32_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    embedding?.dispose();
    classifier?.dispose();
  }
}

main();
