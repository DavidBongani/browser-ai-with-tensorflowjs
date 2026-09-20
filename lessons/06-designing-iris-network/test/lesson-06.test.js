import {
  describe,
  expect,
  it,
} from 'vitest';

import * as tf from '@tensorflow/tfjs';

import {
  createIrisModel,
  describeIrisModel,
} from '../model.js';

describe('Iris model design', () => {
  it('matches the four-feature, three-class data contract', () => {
    const model =
      createIrisModel(tf);

    const description =
      describeIrisModel(model);

    expect(
      description.inputShape,
    ).toEqual([null, 4]);

    expect(
      description.outputShape,
    ).toEqual([null, 3]);

    expect(
      description.layers,
    ).toHaveLength(2);

    expect(
      description.layers[0].units,
    ).toBe(8);

    expect(
      description.layers[0].activation,
    ).toBe('relu');

    expect(
      description.layers[1].units,
    ).toBe(3);

    expect(
      description.layers[1].activation,
    ).toBe('softmax');

    expect(model.loss).toBe(
      'categoricalCrossentropy',
    );

    model.dispose();
  });
});
