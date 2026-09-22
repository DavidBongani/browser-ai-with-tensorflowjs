import { Dataset } from './dataset.js';
import { createClassifier } from './model.js';
import { trainClassifier } from './training.js';
import { classifyEmbedding } from './inference.js';
import { resolveRound } from './game.js';

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

const dataset = new Dataset(MOVES.length);
TRAINING_EXAMPLES.forEach(example => dataset.add(example));

const trainButton = document.querySelector('#train');
const moveButtons = [
  ...document.querySelectorAll('[data-move]'),
];
const status = document.querySelector('#status');
const result = document.querySelector('#result');

let model = null;
let trained = false;

moveButtons.forEach(button => {
  button.disabled = true;
});

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

    trained = true;
    moveButtons.forEach(button => {
      button.disabled = false;
    });

    status.textContent = 'Classifier trained. Choose a move.';

    window.__LESSON_38_TRAINING__ = training;
  } catch (error) {
    console.error(error);
    window.__LESSON_38_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    xs?.dispose();
    ys?.dispose();
    trainButton.disabled = false;
  }
});

moveButtons.forEach(button => {
  button.addEventListener('click', async () => {
    if (!trained || !model) {
      return;
    }

    const requestedMove = button.dataset.move;

    try {
      const prediction = await classifyEmbedding(
        tf,
        model,
        REPRESENTATIVE_EMBEDDINGS[requestedMove],
        MOVES,
      );

      const computerMove =
        requestedMove === 'rock'
          ? 'scissors'
          : requestedMove === 'paper'
            ? 'rock'
            : 'paper';

      const winner = resolveRound(
        prediction.className,
        computerMove,
      );

      const state = {
        requestedMove,
        prediction,
        computerMove,
        winner,
      };

      result.textContent =
        JSON.stringify(state, null, 2);

      status.textContent =
        `${prediction.className} vs ${computerMove}: ${winner}`;

      window.__LESSON_38_RESULT__ = state;
    } catch (error) {
      console.error(error);
      window.__LESSON_38_ERROR__ =
        error instanceof Error ? error.message : String(error);
    }
  });
});
