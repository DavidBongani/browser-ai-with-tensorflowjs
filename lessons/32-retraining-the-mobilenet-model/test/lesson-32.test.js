import { describe, expect, test } from 'vitest';
import * as tf from '@tensorflow/tfjs';
import { createClassifierHead } from '../classifier-head.js';

describe('Lesson 32 transfer-learning classifier head', () => {
  test('matches the embedding and class dimensions', () => {
    const model = createClassifierHead(
      tf,
      1280,
      3,
    );

    expect(model.name).toBe('transfer_classifier');
    expect(model.inputs[0].shape).toEqual([null, 1280]);
    expect(model.outputs[0].shape).toEqual([null, 3]);
    expect(model.layers).toHaveLength(2);
    expect(model.layers[0].units).toBe(100);
    expect(model.layers[1].units).toBe(3);

    model.dispose();
  });

  test('produces normalized class probabilities', () => {
    const model = createClassifierHead(
      tf,
      4,
      3,
    );
    const input = tf.tensor2d([[1, 2, 3, 4]]);
    const prediction = model.predict(input);
    const values = Array.from(prediction.dataSync());

    expect(values).toHaveLength(3);
    expect(
      values.reduce((sum, value) => sum + value, 0),
    ).toBeCloseTo(1, 5);

    input.dispose();
    prediction.dispose();
    model.dispose();
  });
});
