import { describe, expect, it } from 'vitest';
import * as tf from '@tensorflow/tfjs';

describe('Lesson 1 model structure', () => {
  it('can create and compile the one-input one-output model', () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        units: 1,
        inputShape: [1],
      }),
    );

    model.compile({
      optimizer: tf.train.sgd(0.01),
      loss: 'meanSquaredError',
    });

    expect(model.inputs[0].shape).toEqual([null, 1]);
    expect(model.outputs[0].shape).toEqual([null, 1]);

    model.dispose();
  });
});
