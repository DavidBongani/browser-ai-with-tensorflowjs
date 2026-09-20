import { describe, expect, it } from 'vitest';
import { QUESTIONS, scoreResponses } from '../questions.js';

describe('Module 2 self-check', () => {
  it('contains twelve original review questions', () => {
    expect(QUESTIONS).toHaveLength(12);
  });

  it('scores a completely correct response set', () => {
    const score = scoreResponses(
      QUESTIONS.map(question => question.correctIndex),
    );
    expect(score.correct).toBe(12);
    expect(score.total).toBe(12);
  });

  it('rejects incomplete answers', () => {
    expect(() => scoreResponses([0])).toThrow(
      'One response is required',
    );
  });
});
