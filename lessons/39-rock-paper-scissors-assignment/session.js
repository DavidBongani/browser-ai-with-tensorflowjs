import { resolveRound } from './game.js';

export function createScore() {
  return {
    player: 0,
    computer: 0,
    draws: 0,
  };
}

export function recordRound(
  score,
  playerMove,
  computerMove,
) {
  const winner = resolveRound(
    playerMove,
    computerMove,
  );

  if (winner === 'player') {
    score.player += 1;
  } else if (winner === 'computer') {
    score.computer += 1;
  } else {
    score.draws += 1;
  }

  return {
    playerMove,
    computerMove,
    winner,
    score: { ...score },
  };
}
