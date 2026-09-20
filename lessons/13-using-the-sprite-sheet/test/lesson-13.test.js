import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  oneHotArgMax,
} from '../mnist-loader.js';

describe('MNIST sprite label utilities', () => {
  it('finds the active class in a one-hot vector', () => {
    expect(
      oneHotArgMax(
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      ),
    ).toBe(5);
  });
});
