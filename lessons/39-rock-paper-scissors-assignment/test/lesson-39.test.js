import { describe, expect, test } from 'vitest';
import {
  createScore,
  recordRound,
} from '../session.js';

describe('Lesson 39 Rock Paper Scissors assignment', () => {
  test('maintains a running score across rounds', () => {
    const score = createScore();

    const round1 = recordRound(
      score,
      'rock',
      'scissors',
    );
    const round2 = recordRound(
      score,
      'paper',
      'scissors',
    );
    const round3 = recordRound(
      score,
      'rock',
      'rock',
    );

    expect(round1.winner).toBe('player');
    expect(round2.winner).toBe('computer');
    expect(round3.winner).toBe('draw');

    expect(score).toEqual({
      player: 1,
      computer: 1,
      draws: 1,
    });
  });

  test('returns score snapshots instead of live references', () => {
    const score = createScore();

    const round = recordRound(
      score,
      'rock',
      'scissors',
    );

    expect(round.score).toEqual({
      player: 1,
      computer: 0,
      draws: 0,
    });

    score.player = 99;

    expect(round.score.player).toBe(1);
  });
});
