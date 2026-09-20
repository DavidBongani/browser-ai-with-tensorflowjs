export const QUESTIONS = [
  {
    prompt: 'What input shape does the Module 2 CNN expect for one grayscale MNIST image?',
    options: ['[28, 28]', '[28, 28, 1]', '[784, 1]', '[1, 10]'],
    correctIndex: 1,
  },
  {
    prompt: 'What does filters: 8 mean in a Conv2D layer?',
    options: [
      'The layer sees eight images',
      'The layer learns eight output feature maps',
      'The kernel is 8×8',
      'There are eight classes',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why does a valid 5×5 convolution shrink 28 to 24 at stride 1?',
    options: [
      '28 / 5 rounds to 24',
      '28 - 5 + 1 = 24',
      'Pooling removes four pixels',
      'Softmax requires 24 positions',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What is the main purpose of max pooling in this module?',
    options: [
      'Create new labels',
      'Reduce spatial dimensions while retaining strong activations',
      'Convert RGB to grayscale',
      'Normalize pixel values',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Where are tfjs-vis fit callbacks passed?',
    options: [
      'tf.tensor4d()',
      'model.fit() callbacks',
      'model.predict() output',
      'tf.browser.fromPixels()',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does one row of the checked-in MNIST sprite represent?',
    options: [
      'One class label',
      'One flattened 28×28 digit',
      'Ten digits',
      'One RGB channel',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why is the MNIST sprite width 784 pixels?',
    options: [
      'There are 784 classes',
      '28 × 28 = 784 flattened grayscale values',
      'There are 784 labels',
      'The CNN has 784 filters',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What are the tensor shapes for N MNIST examples and their one-hot labels?',
    options: [
      '[N, 784] and [N, 1]',
      '[N, 28, 28, 1] and [N, 10]',
      '[28, 28, N] and [10, N]',
      '[N, 10] and [N, 28, 28, 1]',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does tf.tidy() do in the inference pipeline?',
    options: [
      'Trains the model faster',
      'Disposes temporary tensors created inside the tidy scope',
      'Saves the model to IndexedDB',
      'Changes the optimizer',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does tf.browser.fromPixels(canvas, 1) produce for a grayscale Canvas input?',
    options: [
      'A JavaScript string',
      'A TensorFlow.js pixel tensor with one channel',
      'A one-hot label',
      'A model file',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why resize a 280×280 drawing Canvas to 28×28 before MNIST inference?',
    options: [
      'The model input contract is 28×28×1',
      'Softmax requires 28 pixels',
      'Canvas cannot be larger than 28×28',
      'tfjs-vis only accepts 28×28',
    ],
    correctIndex: 0,
  },
  {
    prompt: 'Why did the three-epoch MNIST build fail the book gate even though the code ran?',
    options: [
      'The browser crashed',
      'Held-out accuracy was below the defined 85% threshold',
      'The sprite failed to load',
      'tf.tidy() disposed the model',
    ],
    correctIndex: 1,
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
