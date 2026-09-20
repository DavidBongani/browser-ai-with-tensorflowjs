import {
  describe,
  expect,
  it,
} from 'vitest';

import * as tf from '@tensorflow/tfjs';

import {
  createMnistCnn,
  describeModel,
} from '../model.js';

describe('Module 2 convolutional network', () => {
  it('matches the expected image and class shapes', () => {
    const model =
      createMnistCnn(tf);

    expect(
      model.inputs[0].shape,
    ).toEqual(
      [null, 28, 28, 1],
    );

    expect(
      model.outputs[0].shape,
    ).toEqual(
      [null, 10],
    );

    const layers =
      describeModel(model);

    expect(
      layers.map(
        layer =>
          layer.name,
      ),
    ).toEqual([
      'Conv2D',
      'MaxPooling2D',
      'Conv2D',
      'MaxPooling2D',
      'Flatten',
      'Dense',
    ]);

    expect(
      layers[0].outputShape,
    ).toEqual(
      [null, 24, 24, 8],
    );

    expect(
      layers[1].outputShape,
    ).toEqual(
      [null, 12, 12, 8],
    );

    expect(
      layers[2].outputShape,
    ).toEqual(
      [null, 8, 8, 16],
    );

    expect(
      layers[3].outputShape,
    ).toEqual(
      [null, 4, 4, 16],
    );

    expect(
      layers[4].outputShape,
    ).toEqual(
      [null, 256],
    );

    expect(
      layers[5].outputShape,
    ).toEqual(
      [null, 10],
    );

    model.dispose();
  });
});
