import { describe, expect, it } from 'vitest';
import { parseIdxImages, parseIdxLabels } from '../fashion-loader.js';

function makeImageIdx() {
  const buffer = new ArrayBuffer(16 + 2 * 784);
  const view = new DataView(buffer);
  view.setUint32(0, 2051);
  view.setUint32(4, 2);
  view.setUint32(8, 28);
  view.setUint32(12, 28);
  const bytes = new Uint8Array(buffer, 16);
  bytes[0] = 255;
  bytes[783] = 128;
  return buffer;
}

function makeLabelIdx() {
  const buffer = new ArrayBuffer(10);
  const view = new DataView(buffer);
  view.setUint32(0, 2049);
  view.setUint32(4, 2);
  const labels = new Uint8Array(buffer, 8);
  labels[0] = 9;
  labels[1] = 3;
  return buffer;
}

describe('Fashion-MNIST IDX parser', () => {
  it('parses and normalizes image IDX data', () => {
    const images = parseIdxImages(makeImageIdx());
    expect(images.count).toBe(2);
    expect(images.rows).toBe(28);
    expect(images.columns).toBe(28);
    expect(images.pixels[0]).toBe(1);
    expect(images.pixels[783]).toBeCloseTo(128 / 255, 6);
  });

  it('parses label IDX data', () => {
    const labels = parseIdxLabels(makeLabelIdx());
    expect(labels.count).toBe(2);
    expect(Array.from(labels.labels)).toEqual([9, 3]);
  });
});
