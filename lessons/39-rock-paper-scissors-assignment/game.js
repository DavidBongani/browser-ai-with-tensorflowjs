export const MOVES = [
  'rock',
  'paper',
  'scissors',
];

export function resolveRound(
  playerMove,
  computerMove,
) {
  if (
    !MOVES.includes(playerMove) ||
    !MOVES.includes(computerMove)
  ) {
    throw new Error('Unknown Rock Paper Scissors move.');
  }

  if (playerMove === computerMove) {
    return 'draw';
  }

  const winsAgainst = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  return winsAgainst[playerMove] === computerMove
    ? 'player'
    : 'computer';
}
