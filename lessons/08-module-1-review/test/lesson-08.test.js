import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  QUESTIONS,
  scoreResponses,
} from '../questions.js';

describe('Module 1 self-check', () => {
  it('contains twelve original review questions', () => {
    expect(
      QUESTIONS,
    ).toHaveLength(12);
  });

  it('scores a completely correct response set', () => {
    const answers =
      QUESTIONS.map(
        question =>
          question.correctIndex,
      );

    const score =
      scoreResponses(
        answers,
      );

    expect(score.correct).toBe(12);
    expect(score.total).toBe(12);
  });

  it('rejects an incomplete response array', () => {
    expect(
      () => scoreResponses([0]),
    ).toThrow(
      'One response is required',
    );
  });
});
