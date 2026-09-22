import { describe, expect, test } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import { Dataset } from '../dataset.js';
import { createClassifier } from '../model.js';
import { trainClassifier } from '../training.js';
import { classifyEmbedding } from '../inference.js';

describe('Lesson 37 inference', () => {
  test('classifies a new embedding after training', async () => {
    const dataset = new Dataset(3);

    [
      { classId: 0, featureValues: [1, 0, 0, 0] },
      { classId: 0, featureValues: [0.9, 0.1, 0, 0] },
      { classId: 1, featureValues: [0, 1, 0, 0] },
      { classId: 1, featureValues: [0.1, 0.9, 0, 0] },
      { classId: 2, featureValues: [0, 0, 1, 0] },
      { classId: 2, featureValues: [0, 0.1, 0.9, 0] },
    ].forEach(example => dataset.add(example));

    const { xs, ys } = dataset.toTensors(tf);
    const model = createClassifier(
      tf,
      dataset.embeddingSize,
      dataset.classCount,
    );

    try {
      const training = await trainClassifier(
        model,
        xs,
        ys,
        {
          epochs: 80,
          batchSize: dataset.size,
          shuffle: false,
        },
      );

      const prediction = await classifyEmbedding(
        tf,
        model,
        [0, 0.05, 0.95, 0],
        ['square', 'circle', 'triangle'],
      );

      expect(training.finalLoss).toBeLessThan(
        training.initialLoss,
      );
      expect(prediction.className).toBe('triangle');
      expect(prediction.classId).toBe(2);
      expect(prediction.confidence).toBeGreaterThan(0.8);
      expect(prediction.scores).toHaveLength(3);
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
    }
  });

  test('rejects embeddings with the wrong width', async () => {
    const model = createClassifier(tf, 4, 3);

    try {
      await expect(
        classifyEmbedding(
          tf,
          model,
          [1, 2],
          ['square', 'circle', 'triangle'],
        ),
      ).rejects.toThrow(/Expected 4 embedding values/);
    } finally {
      model.dispose();
    }
  });
});
