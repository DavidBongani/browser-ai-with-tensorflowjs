import { Dataset } from './dataset.js';
import { createClassifier } from './model.js';
import { trainClassifier } from './training.js';
import { classifyEmbedding } from './inference.js';
import {
  createScore,
  recordRound,
} from './session.js';

const MOVES = ['rock', 'paper', 'scissors'];

const REPRESENTATIVE_EMBEDDINGS = {
  rock: [1, 0, 0, 0],
  paper: [0, 1, 0, 0],
  scissors: [0, 0, 1, 0],
};

const TRAINING_EXAMPLES = [
  { classId: 0, featureValues: [1, 0, 0, 0] },
  { classId: 0, featureValues: [0.9, 0.1, 0, 0] },
  { classId: 1, featureValues: [0, 1, 0, 0] },
  { classId: 1, featureValues: [0.1, 0.9, 0, 0] },
  { classId: 2, featureValues: [0, 0, 1, 0] },
  { classId: 2, featureValues: [0, 0.1, 0.9, 0] },
];

const COMPUTER_SEQUENCE = [
  'scissors',
  'scissors',
  'rock',
];

const dataset = new Dataset(MOVES.length);
TRAINING_EXAMPLES.forEach(example => dataset.add(example));

const trainButton = document.querySelector('#train');
const resetButton = document.querySelector('#reset');
const moveButtons = [
  ...document.querySelectorAll('[data-move]'),
];
const status = document.querySelector('#status');
const scoreElement = document.querySelector('#score');
const historyElement = document.querySelector('#history');

let model = null;
let score = createScore();
let history = [];
let roundIndex = 0;

moveButtons.forEach(button => {
  button.disabled = true;
});

function renderScore() {
  scoreElement.textContent =
    `Player ${score.player} — Computer ${score.computer} — Draws ${score.draws}`;
}

function renderHistory() {
  historyElement.replaceChildren();

  for (const round of history) {
    const item = document.createElement('li');
    item.textContent =
      `${round.playerMove} vs ${round.computerMove}: ${round.winner}`;
    historyElement.append(item);
  }
}

trainButton.addEventListener('click', async () => {
  trainButton.disabled = true;

  let xs;
  let ys;

  try {
    ({ xs, ys } = dataset.toTensors(tf));

    model?.dispose();

    model = createClassifier(
      tf,
      dataset.embeddingSize,
      dataset.classCount,
    );

    const training = await trainClassifier(
      model,
      xs,
      ys,
      {
        epochs: 80,
        batchSize: dataset.size,
        shuffle: false,
      },
    );

    moveButtons.forEach(button => {
      button.disabled = false;
    });

    status.textContent =
      'Classifier trained. Play a round.';

    window.__LESSON_39_TRAINING__ = training;
  } catch (error) {
    console.error(error);
    window.__LESSON_39_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    xs?.dispose();
    ys?.dispose();
    trainButton.disabled = false;
  }
});

moveButtons.forEach(button => {
  button.addEventListener('click', async () => {
    if (!model) {
      return;
    }

    try {
      const requestedMove = button.dataset.move;
      const prediction = await classifyEmbedding(
        tf,
        model,
        REPRESENTATIVE_EMBEDDINGS[requestedMove],
        MOVES,
      );

      const computerMove =
        COMPUTER_SEQUENCE[
          roundIndex % COMPUTER_SEQUENCE.length
        ];

      roundIndex += 1;

      const round = recordRound(
        score,
        prediction.className,
        computerMove,
      );

      history.push({
        ...round,
        requestedMove,
        confidence: prediction.confidence,
      });

      renderScore();
      renderHistory();

      status.textContent =
        `Round ${history.length}: ${round.winner}`;

      window.__LESSON_39_STATE__ = {
        score: { ...score },
        history: history.map(item => ({
          ...item,
          score: { ...item.score },
        })),
      };
    } catch (error) {
      console.error(error);
      window.__LESSON_39_ERROR__ =
        error instanceof Error ? error.message : String(error);
    }
  });
});

resetButton.addEventListener('click', () => {
  score = createScore();
  history = [];
  roundIndex = 0;
  renderScore();
  renderHistory();
  status.textContent = 'Score reset.';

  window.__LESSON_39_STATE__ = {
    score: { ...score },
    history: [],
  };
});

renderScore();

window.__LESSON_39_STATE__ = {
  score: { ...score },
  history: [],
};
