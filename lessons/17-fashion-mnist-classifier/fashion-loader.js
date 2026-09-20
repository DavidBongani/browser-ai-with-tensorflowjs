export const FASHION_CLASSES = [
  'T-shirt/top','Trouser','Pullover','Dress','Coat',
  'Sandal','Shirt','Sneaker','Bag','Ankle boot',
];

export function parseIdxImages(buffer, limit) {
  const view = new DataView(buffer);
  const magic = view.getUint32(0);
  const count = view.getUint32(4);
  const rows = view.getUint32(8);
  const columns = view.getUint32(12);

  if (magic !== 2051) throw new Error('Invalid IDX image magic number.');
  if (rows !== 28 || columns !== 28) {
    throw new Error('Expected 28x28 Fashion-MNIST images.');
  }

  const selectedCount = Math.min(limit ?? count, count);
  const imageSize = rows * columns;
  const requiredBytes = 16 + selectedCount * imageSize;
  if (buffer.byteLength < requiredBytes) {
    throw new Error('IDX image file is truncated.');
  }

  const source = new Uint8Array(buffer, 16, selectedCount * imageSize);
  const normalized = new Float32Array(source.length);

  for (let index = 0; index < source.length; index += 1) {
    normalized[index] = source[index] / 255;
  }

  return {count: selectedCount, rows, columns, pixels: normalized};
}

export function parseIdxLabels(buffer, limit) {
  const view = new DataView(buffer);
  const magic = view.getUint32(0);
  const count = view.getUint32(4);

  if (magic !== 2049) throw new Error('Invalid IDX label magic number.');

  const selectedCount = Math.min(limit ?? count, count);
  if (buffer.byteLength < 8 + selectedCount) {
    throw new Error('IDX label file is truncated.');
  }

  return {
    count: selectedCount,
    labels: new Uint8Array(buffer, 8, selectedCount),
  };
}

async function gunzip(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  if (typeof DecompressionStream !== 'function') {
    throw new Error('This browser does not support DecompressionStream.');
  }

  const decompressed = response.body.pipeThrough(
    new DecompressionStream('gzip'),
  );
  return new Response(decompressed).arrayBuffer();
}

export async function loadFashionMnist(tf, {imagesUrl, labelsUrl, count}) {
  const [imageBuffer, labelBuffer] = await Promise.all([
    gunzip(imagesUrl),
    gunzip(labelsUrl),
  ]);

  const images = parseIdxImages(imageBuffer, count);
  const labels = parseIdxLabels(labelBuffer, count);

  if (images.count !== labels.count) {
    throw new Error('Image and label counts do not match.');
  }

  const xs = tf.tensor4d(
    images.pixels,
    [images.count, 28, 28, 1],
  );

  const labelIds = tf.tensor1d(labels.labels, 'int32');
  const ys = tf.oneHot(labelIds, FASHION_CLASSES.length);
  labelIds.dispose();

  return {xs, ys, labels: labels.labels};
}
