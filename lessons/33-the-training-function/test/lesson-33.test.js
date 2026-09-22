import { describe, expect, test } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import {
  createTrainingModel,
  createTrainingTensors,
} from '../model.js';
import {
  trainClassifier,
  validateTrainingData,
} from '../training.js';

describe('Lesson 33 training function', () => {
  test('rejects mismatched feature and label counts', () => {
    const xs = tf.zeros([2, 4]);
    const ys = tf.zeros([3, 3]);

    expect(() => validateTrainingData(xs, ys))
      .toThrow(/same number of examples/);

    xs.dispose();
    ys.dispose();
  });

  test('trains a three-class classifier on embeddings', async () => {
    const model = createTrainingModel(tf);
    const { xs, ys } = createTrainingTensors(tf);

    const result = await trainClassifier(
      model,
      xs,
      ys,
      {
        epochs: 60,
        batchSize: 6,
        shuffle: false,
      },
    );

    expect(result.epochs).toBe(60);
    expect(result.batchSize).toBe(6);
    expect(result.finalLoss)
      .toBeLessThan(result.initialLoss);
    expect(result.finalAccuracy)
      .toBeGreaterThanOrEqual(0.99);

    xs.dispose();
    ys.dispose();
    model.dispose();
  });
});
