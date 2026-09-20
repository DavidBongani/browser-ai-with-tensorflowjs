export const IMAGE_HEIGHT = 28;
export const IMAGE_WIDTH = 28;
export const IMAGE_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH;
export const CLASS_COUNT = 10;
export const DATASET_SIZE = 65000;

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

export function oneHotArgMax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > bestValue) {
      bestValue = values[index];
      bestIndex = index;
    }
  }

  return bestIndex;
}

export async function loadMnistSlice(
  tf,
  {
    start = 0,
    count = 100,
    chunkRows = 250,
  } = {},
) {
  if (
    start < 0
    || count < 1
    || start + count > DATASET_SIZE
  ) {
    throw new Error('Requested MNIST slice is out of range.');
  }

  const [sprite, labelsResponse] = await Promise.all([
    loadImage(SPRITE_URL),
    fetch(LABELS_URL),
  ]);

  if (!labelsResponse.ok) {
    throw new Error('Unable to load MNIST labels.');
  }

  if (
    sprite.naturalWidth !== IMAGE_SIZE
    || sprite.naturalHeight !== DATASET_SIZE
  ) {
    throw new Error('Unexpected MNIST sprite dimensions.');
  }

  const allLabels = new Uint8Array(
    await labelsResponse.arrayBuffer(),
  );

  const pixels = new Float32Array(
    count * IMAGE_SIZE,
  );

  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = Math.min(chunkRows, count);
  const context = canvas.getContext('2d', {
    willReadFrequently: true,
  });

  for (
    let offset = 0;
    offset < count;
    offset += chunkRows
  ) {
    const rows = Math.min(
      chunkRows,
      count - offset,
    );

    canvas.height = rows;
    context.clearRect(0, 0, IMAGE_SIZE, rows);

    context.drawImage(
      sprite,
      0,
      start + offset,
      IMAGE_SIZE,
      rows,
      0,
      0,
      IMAGE_SIZE,
      rows,
    );

    const rgba = context.getImageData(
      0,
      0,
      IMAGE_SIZE,
      rows,
    ).data;

    const destinationOffset =
      offset * IMAGE_SIZE;

    for (
      let pixelIndex = 0;
      pixelIndex < rows * IMAGE_SIZE;
      pixelIndex += 1
    ) {
      pixels[
        destinationOffset + pixelIndex
      ] =
        rgba[pixelIndex * 4] / 255;
    }
  }

  const labelStart =
    start * CLASS_COUNT;

  const labelEnd =
    (start + count) * CLASS_COUNT;

  const labels =
    allLabels.slice(
      labelStart,
      labelEnd,
    );

  const xs = tf.tensor4d(
    pixels,
    [
      count,
      IMAGE_HEIGHT,
      IMAGE_WIDTH,
      1,
    ],
  );

  const ys = tf.tensor2d(
    labels,
    [
      count,
      CLASS_COUNT,
    ],
  );

  return {
    xs,
    ys,
    raw: {
      pixels,
      labels,
    },
  };
}
