import {
  CLASS_COUNT,
  DATASET_SIZE,
  IMAGE_HEIGHT,
  IMAGE_SIZE,
  IMAGE_WIDTH,
  drawFlattenedDigit,
  extractGrayRow,
} from './sprite.js';

const SPRITE_URL =
  '../../shared/datasets/mnist/mnist_images.png';

const LABELS_URL =
  '../../shared/datasets/mnist/mnist_labels_uint8';

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(
      new Error('Unable to load MNIST sprite image.'),
    );
    image.src = url;
  });
}

async function main() {
  const [sprite, labelResponse] = await Promise.all([
    loadImage(SPRITE_URL),
    fetch(LABELS_URL),
  ]);

  if (!labelResponse.ok) {
    throw new Error('Unable to load MNIST labels.');
  }

  const labels = new Uint8Array(
    await labelResponse.arrayBuffer(),
  );

  const rowCanvas = document.createElement('canvas');
  rowCanvas.width = sprite.naturalWidth;
  rowCanvas.height = 1;

  const rowContext = rowCanvas.getContext('2d');
  rowContext.drawImage(
    sprite,
    0, 0,
    sprite.naturalWidth, 1,
    0, 0,
    sprite.naturalWidth, 1,
  );

  const rowRgba = rowContext.getImageData(
    0, 0, sprite.naturalWidth, 1,
  ).data;

  const firstDigitPixels = extractGrayRow(rowRgba);

  const outputCanvas = document.querySelector('#digit');
  const outputContext = outputCanvas.getContext('2d');
  drawFlattenedDigit(outputContext, firstDigitPixels);

  const firstLabel = Array.from(
    labels.slice(0, CLASS_COUNT),
  );

  const result = {
    spriteWidth: sprite.naturalWidth,
    spriteHeight: sprite.naturalHeight,
    imageWidth: IMAGE_WIDTH,
    imageHeight: IMAGE_HEIGHT,
    flattenedPixelsPerImage: IMAGE_SIZE,
    datasetSize: DATASET_SIZE,
    labelBytes: labels.length,
    firstLabel,
    reconstructedCanvas: {
      width: outputCanvas.width,
      height: outputCanvas.height,
    },
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent =
    'Sprite inspected';

  window.__LESSON_12_RESULT__ = result;
}

main().catch(error => {
  console.error(error);
  window.__LESSON_12_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
