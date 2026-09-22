import { describe, expect, test } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import { Dataset } from '../dataset.js';
import { createClassifier } from '../model.js';
import { trainClassifier } from '../training.js';
import { classifyEmbedding } from '../inference.js';
import { resolveRound } from '../game.js';

describe('Lesson 38 Rock Paper Scissors', () => {
  test('implements all game outcomes', () => {
    expect(resolveRound('rock', 'scissors')).toBe('player');
    expect(resolveRound('paper', 'rock')).toBe('player');
    expect(resolveRound('scissors', 'paper')).toBe('player');

    expect(resolveRound('rock', 'paper')).toBe('computer');
    expect(resolveRound('paper', 'scissors')).toBe('computer');
    expect(resolveRound('scissors', 'rock')).toBe('computer');

    expect(resolveRound('rock', 'rock')).toBe('draw');
    expect(resolveRound('paper', 'paper')).toBe('draw');
    expect(resolveRound('scissors', 'scissors')).toBe('draw');
  });

  test('classifies all three representative moves', async () => {
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
    const model = createClassifier(tf, 4, 3);

    try {
      await trainClassifier(
        model,
        xs,
        ys,
        {
          epochs: 80,
          batchSize: dataset.size,
          shuffle: false,
        },
      );

      const names = ['rock', 'paper', 'scissors'];
      const inputs = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
      ];

      const predictions = [];

      for (const input of inputs) {
        predictions.push(
          await classifyEmbedding(
            tf,
            model,
            input,
            names,
          ),
        );
      }

      expect(
        predictions.map(item => item.className),
      ).toEqual(names);

      predictions.forEach(item => {
        expect(item.confidence).toBeGreaterThan(0.8);
      });
    } finally {
      xs.dispose();
      ys.dispose();
      model.dispose();
    }
  });
});
