export const QUESTIONS = [
  {
    prompt: 'What input shape does the Module 2 CNN expect for one grayscale image?',
    options: ['[28, 28]', '[28, 28, 1]', '[784, 1]', '[1, 784]'],
    correctIndex: 1,
  },
  {
    prompt: 'In Conv2D, what does filters: 8 specify?',
    options: [
      'Eight training epochs',
      'Eight learned output feature maps',
      'An 8×8 input image',
      'Eight target classes',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does kernelSize: 5 mean in the first convolution?',
    options: [
      'Five output classes',
      'A 5×5 local filter window',
      'Five image channels',
      'Five pooling operations',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What is the output spatial size of a valid 5×5 convolution on 28×28 input with stride 1?',
    options: ['28×28', '24×24', '14×14', '5×5'],
    correctIndex: 1,
  },
  {
    prompt: 'What does a 2×2 max-pooling layer with stride 2 do to a 24×24 feature map?',
    options: ['24×24 → 48×48', '24×24 → 12×12', '24×24 → 20×20', '24×24 → 2×2'],
    correctIndex: 1,
  },
  {
    prompt: 'Where are tfjs-vis fit callbacks passed?',
    options: [
      'tf.ready()',
      'model.fit() callbacks',
      'tf.oneHot()',
      'model.predict() input',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why is the MNIST sprite 784 pixels wide?',
    options: [
      'There are 784 classes',
      '28×28 pixels are flattened into one sprite row',
      'The browser requires that width',
      'There are 784 labels',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What image tensor shape should 100 sprite examples become?',
    options: [
      '[100, 784]',
      '[100, 28, 28, 1]',
      '[28, 28, 100]',
      '[100, 10]',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why are sprite pixel bytes divided by 255?',
    options: [
      'To create ten classes',
      'To normalize values into 0..1',
      'To one-hot encode labels',
      'To reduce image width',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does tf.tidy() help prevent during repeated preprocessing/inference?',
    options: [
      'Class imbalance',
      'Temporary tensor accumulation',
      'Incorrect labels',
      'Slow network requests',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does tf.browser.fromPixels(canvas, 1) create in the MNIST drawing app?',
    options: [
      'A one-channel tensor from Canvas pixels',
      'A one-hot label',
      'A trained model',
      'A sprite sheet',
    ],
    correctIndex: 0,
  },
  {
    prompt: 'Why is a 280×280 drawing resized to 28×28 before prediction?',
    options: [
      'The CNN was trained on 28×28 image inputs',
      'Softmax only accepts 28 values',
      'tfjs-vis requires it',
      'The sprite contains 280 rows',
    ],
    correctIndex: 0,
  },
];

export function scoreResponses(responses) {
  if (!Array.isArray(responses) || responses.length !== QUESTIONS.length) {
    throw new Error('One response is required for every question.');
  }

  const results = QUESTIONS.map((question, index) => ({
    correct: responses[index] === question.correctIndex,
    selected: responses[index],
    correctIndex: question.correctIndex,
  }));

  return {
    total: QUESTIONS.length,
    correct: results.filter(item => item.correct).length,
    results,
  };
}
