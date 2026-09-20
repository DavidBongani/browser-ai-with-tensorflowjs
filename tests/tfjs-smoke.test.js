import { describe, expect, it } from 'vitest';
import * as tf from '@tensorflow/tfjs';

describe('TensorFlow.js teaching baseline', () => {
  it('uses the pinned TensorFlow.js version and performs tensor arithmetic', () => {
    expect(tf.version.tfjs).toBe('4.22.0');

    const result = tf.tidy(() => {
      const xs = tf.tensor1d([1, 2, 3]);
      return Array.from(xs.mul(2).dataSync());
    });

    expect(result).toEqual([2, 4, 6]);
  });
});
