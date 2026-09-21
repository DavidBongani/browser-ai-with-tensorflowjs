import { describe, expect, test } from 'vitest';
import {
  TOXICITY_LABELS,
  classifyProbabilityPair,
  summarizePrediction,
} from '../classifier-output.js';

describe('Lesson 19 toxicity classifier output contract', () => {
  test('documents the seven prediction heads', () => {
    expect(TOXICITY_LABELS).toEqual([
      'identity_attack',
      'insult',
      'obscene',
      'severe_toxicity',
      'sexual_explicit',
      'threat',
      'toxicity',
    ]);
  });

  test('returns true when positive probability meets threshold', () => {
    expect(
      classifyProbabilityPair([0.08, 0.92], 0.9),
    ).toBe(true);
  });

  test('returns false when negative probability meets threshold', () => {
    expect(
      classifyProbabilityPair([0.97, 0.03], 0.9),
    ).toBe(false);
  });

  test('returns null when neither probability meets threshold', () => {
    expect(
      classifyProbabilityPair([0.55, 0.45], 0.9),
    ).toBeNull();
  });

  test('preserves label and raw probabilities', () => {
    expect(
      summarizePrediction(
        'insult',
        [0.08, 0.92],
        0.9,
      ),
    ).toEqual({
      label: 'insult',
      probabilities: [0.08, 0.92],
      match: true,
    });
  });
});
