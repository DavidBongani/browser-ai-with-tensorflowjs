import { describe, expect, test } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import { Dataset } from '../dataset.js';

describe('Lesson 35 Dataset class', () => {
  test('tracks counts and embedding width', () => {
    const dataset = new Dataset(3);

    dataset
      .add({
        classId: 0,
        featureValues: [1, 0, 0, 0],
      })
      .add({
        classId: 1,
        featureValues: [0, 1, 0, 0],
      })
      .add({
        classId: 2,
        featureValues: [0, 0, 1, 0],
      });

    expect(dataset.size).toBe(3);
    expect(dataset.counts).toEqual([1, 1, 1]);
    expect(dataset.embeddingSize).toBe(4);
    expect(dataset.canTrain()).toBe(true);
  });

  test('rejects inconsistent feature widths', () => {
    const dataset = new Dataset(3);

    dataset.add({
      classId: 0,
      featureValues: [1, 0, 0, 0],
    });

    expect(() =>
      dataset.add({
        classId: 1,
        featureValues: [0, 1, 0],
      }),
    ).toThrow(/same embedding width/);
  });

  test('creates rank-2 feature and one-hot label tensors', async () => {
    const dataset = new Dataset(3);

    [
      { classId: 0, featureValues: [1, 0] },
      { classId: 1, featureValues: [0, 1] },
      { classId: 2, featureValues: [1, 1] },
    ].forEach(example => dataset.add(example));

    const { xs, ys } = dataset.toTensors(tf);

    try {
      expect(xs.shape).toEqual([3, 2]);
      expect(ys.shape).toEqual([3, 3]);

      expect(
        Array.from(await ys.data()),
      ).toEqual([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ]);
    } finally {
      xs.dispose();
      ys.dispose();
    }
  });
});
