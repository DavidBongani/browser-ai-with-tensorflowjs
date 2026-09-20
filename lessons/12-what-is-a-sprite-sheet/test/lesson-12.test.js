import { describe, expect, it } from 'vitest';
import {
  IMAGE_SIZE,
  extractGrayRow,
} from '../sprite.js';

describe('MNIST sprite utilities', () => {
  it('extracts the grayscale red channel from one flattened sprite row', () => {
    const rgba = new Uint8ClampedArray(IMAGE_SIZE * 4);

    for (let index = 0; index < IMAGE_SIZE; index += 1) {
      rgba[index * 4] = index % 256;
      rgba[index * 4 + 1] = 99;
      rgba[index * 4 + 2] = 42;
      rgba[index * 4 + 3] = 255;
    }

    const pixels = extractGrayRow(rgba);

    expect(pixels).toHaveLength(784);
    expect(pixels[0]).toBe(0);
    expect(pixels[255]).toBe(255);
    expect(pixels[256]).toBe(0);
  });
});
