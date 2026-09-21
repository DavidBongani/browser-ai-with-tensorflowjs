import { describe, expect, test } from 'vitest';
import {
  standardConvParameters,
  depthwiseSeparableParameters,
  compareConvolutions,
} from '../mobilenet-math.js';

describe('Lesson 21 MobileNet parameter math', () => {
  test('computes standard convolution parameters', () => {
    expect(
      standardConvParameters(3, 32, 64),
    ).toBe(18432);
  });

  test('computes depthwise separable parameters', () => {
    expect(
      depthwiseSeparableParameters(3, 32, 64),
    ).toEqual({
      depthwise: 288,
      pointwise: 2048,
      total: 2336,
    });
  });

  test('shows a large parameter reduction', () => {
    const result = compareConvolutions(3, 32, 64);

    expect(result.standard).toBe(18432);
    expect(result.separable).toBe(2336);
    expect(result.reduction).toBeCloseTo(
      1 - 2336 / 18432,
      10,
    );
    expect(result.reduction).toBeGreaterThan(0.87);
  });
});
