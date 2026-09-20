export const IMAGE_HEIGHT = 28;
export const IMAGE_WIDTH = 28;
export const IMAGE_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH;
export const DATASET_SIZE = 65000;
export const CLASS_COUNT = 10;

export function extractGrayRow(rgba, expectedPixels = IMAGE_SIZE) {
  if (rgba.length !== expectedPixels * 4) {
    throw new Error(
      'Unexpected RGBA row length.',
    );
  }

  const pixels = new Uint8ClampedArray(expectedPixels);

  for (let index = 0; index < expectedPixels; index += 1) {
    pixels[index] = rgba[index * 4];
  }

  return pixels;
}

export function drawFlattenedDigit(ctx, pixels) {
  if (pixels.length !== IMAGE_SIZE) {
    throw new Error('Expected exactly 784 grayscale pixels.');
  }

  const imageData = ctx.createImageData(
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
  );

  for (let index = 0; index < pixels.length; index += 1) {
    const value = pixels[index];
    const offset = index * 4;

    imageData.data[offset] = value;
    imageData.data[offset + 1] = value;
    imageData.data[offset + 2] = value;
    imageData.data[offset + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
