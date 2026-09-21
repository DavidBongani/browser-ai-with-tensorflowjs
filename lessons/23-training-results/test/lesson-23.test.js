import { describe, expect, test } from 'vitest';
import { rankPredictions, confidenceGap } from '../results.js';

describe('Lesson 23 MobileNet result interpretation', () => {
  const predictions = [
    { className: 'cup', probability: 0.06 },
    { className: 'espresso', probability: 0.72 },
    { className: 'coffee mug', probability: 0.19 },
  ];

  test('ranks predictions by probability', () => {
    expect(rankPredictions(predictions).map(x => x.className)).toEqual([
      'espresso', 'coffee mug', 'cup',
    ]);
  });

  test('converts probability to percentage', () => {
    expect(rankPredictions(predictions)[0].percent).toBeCloseTo(72, 8);
  });

  test('computes the top-two confidence gap', () => {
    expect(confidenceGap(predictions)).toBeCloseTo(0.53, 8);
  });
});
