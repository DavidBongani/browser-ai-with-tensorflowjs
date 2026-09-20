import {
  describe,
  expect,
  it,
} from 'vitest';

import * as tf from '@tensorflow/tfjs';

import {
  SPECIES,
  labelsToIndices,
  speciesToIndex,
} from '../encoding.js';

describe('Iris one-hot encoding', () => {
  it('uses a stable class order', () => {
    expect(SPECIES).toEqual([
      'Iris-setosa',
      'Iris-versicolor',
      'Iris-virginica',
    ]);

    expect(
      labelsToIndices(SPECIES),
    ).toEqual([0, 1, 2]);
  });

  it('creates the expected one-hot vectors', async () => {
    const ids = tf.tensor1d(
      [0, 1, 2],
      'int32',
    );

    const encoded =
      tf.oneHot(ids, 3);

    expect(
      await encoded.array(),
    ).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);

    ids.dispose();
    encoded.dispose();
  });

  it('rejects unknown labels', () => {
    expect(
      () => speciesToIndex('unknown'),
    ).toThrow(
      'Unknown Iris species',
    );
  });
});
