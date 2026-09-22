import {
  captureExample,
  countExamples,
} from './capture.js';

const CLASS_COUNT = 3;
const examples = [];

const canvas = document.querySelector('#sample');
const context = canvas.getContext('2d');
const status = document.querySelector('#status');
const counts = document.querySelector('#counts');
const latest = document.querySelector('#latest');
const buttons = [
  ...document.querySelectorAll('[data-class-id]'),
];

let featureExtractor = null;

function drawSample(classId) {
  context.clearRect(0, 0, 224, 224);
  context.fillStyle = '#f4f4f4';
  context.fillRect(0, 0, 224, 224);

  if (classId === 0) {
    context.fillStyle = '#222';
    context.fillRect(42, 42, 140, 140);
  } else if (classId === 1) {
    context.fillStyle = '#555';
    context.beginPath();
    context.arc(112, 112, 70, 0, Math.PI * 2);
    context.fill();
  } else {
    context.fillStyle = '#888';
    context.beginPath();
    context.moveTo(112, 32);
    context.lineTo(192, 186);
    context.lineTo(32, 186);
    context.closePath();
    context.fill();
  }
}

function renderCounts() {
  counts.textContent =
    countExamples(
      examples,
      CLASS_COUNT,
    ).join(' / ');
}

async function handleCapture(event) {
  const button = event.currentTarget;
  const classId = Number(button.dataset.classId);

  buttons.forEach(control => {
    control.disabled = true;
  });

  try {
    drawSample(classId);

    const example = await captureExample({
      featureExtractor,
      source: canvas,
      classId,
      classCount: CLASS_COUNT,
    });

    examples.push(example);
    renderCounts();

    latest.textContent = JSON.stringify(
      {
        classId: example.classId,
        embeddingSize: example.embeddingSize,
        firstValues:
          example.featureValues.slice(0, 4),
      },
      null,
      2,
    );

    status.textContent =
      `Captured class ${classId + 1}.`;

    window.__LESSON_34_STATE__ = {
      ready: true,
      counts: countExamples(
        examples,
        CLASS_COUNT,
      ),
      exampleCount: examples.length,
      embeddingSizes:
        examples.map(item => item.embeddingSize),
    };
  } catch (error) {
    console.error(error);
    window.__LESSON_34_ERROR__ =
      error instanceof Error ? error.message : String(error);
  } finally {
    buttons.forEach(control => {
      control.disabled = false;
    });
  }
}

async function main() {
  await tf.ready();

  featureExtractor = await mobilenet.load({
    version: 2,
    alpha: 1,
  });

  buttons.forEach(button => {
    button.addEventListener(
      'click',
      handleCapture,
    );
    button.disabled = false;
  });

  status.textContent =
    'MobileNet is ready. Capture an example.';

  window.__LESSON_34_STATE__ = {
    ready: true,
    counts: [0, 0, 0],
    exampleCount: 0,
    embeddingSizes: [],
  };
}

buttons.forEach(button => {
  button.disabled = true;
});

main().catch(error => {
  console.error(error);
  window.__LESSON_34_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
