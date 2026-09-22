import { describe, expect, test } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import { Dataset } from '../dataset.js';
import { createClassifier } from '../model.js';
import { trainClassifier } from '../training.js';

function createDataset() {
  const dataset = new Dataset(3);

  [
    { classId: 0, featureValues: [1, 0, 0, 0] },
    { classId: 0, featureValues: [0.9, 0.1, 0, 0] },
    { classId: 1, featureValues: [0, 1, 0, 0] },
    { classId: 1, featureValues: [0.1, 0.9, 0, 0] },
    { classId: 2, featureValues: [0, 0, 1, 0] },
    { classId: 2, featureValues: [0, 0.1, 0.9, 0] },
  ].forEach(example => dataset.add(example));

  return dataset;
}

describe('Lesson 36 training captured data', () => {
  test('trains a classifier from Dataset tensors', async () => {
    const dataset = createDataset();
    const { xs, ys } = dataset.toTensors(tf);
    const model = createClassifier(
      tf,
      dataset.embeddingSize,
      dataset.classCount,
    );

    try {
      const result = await trainClassifier(
        model,
        xs,
        ys,
        {
          epochs: 60,
          batchSize: dataset.size,
          shuffle: false,
        },
      );

      expect(result.finalLoss)
        .toBeLessThan(result.initialLoss * 0.2);
      expect(result.finalAccuracy)
        .toBeGreaterThanOrEqual(0.95);
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
    }
  });

  test('keeps captured tensor shapes aligned', () => {
    const dataset = createDataset();
    const { xs, ys } = dataset.toTensors(tf);

    try {
      expect(xs.shape).toEqual([6, 4]);
      expect(ys.shape).toEqual([6, 3]);
    } finally {
      xs.dispose();
      ys.dispose();
    }
  });
});
