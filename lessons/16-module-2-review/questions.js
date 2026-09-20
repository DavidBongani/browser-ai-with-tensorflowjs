export const QUESTIONS = [
  {
    prompt: 'What input shape does the Module 2 grayscale CNN expect for one image?',
    options: ['[784]', '[28, 28]', '[28, 28, 1]', '[1, 10]'],
    correctIndex: 2,
  },
  {
    prompt: 'What does filters: 8 mean in a Conv2D layer?',
    options: [
      'The layer accepts eight images',
      'The layer learns eight output feature maps',
      'Every kernel is 8×8',
      'The model has eight classes',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why does a valid 5×5 convolution shrink 28 to 24 when stride is 1?',
    options: [
      '28 / 5 rounds to 24',
      'The kernel cannot extend outside the valid input area',
      'Max pooling always removes four pixels',
      'Softmax reduces the image',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What is the main purpose of max pooling in the tested CNN?',
    options: [
      'Create class labels',
      'Reduce spatial dimensions while retaining strong local activations',
      'Normalize pixel values',
      'Convert labels to one-hot vectors',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Where are tfjs-vis fit callbacks passed?',
    options: [
      'tf.tensor4d()',
      'model.fit() callbacks',
      'model.predict() output',
      'tf.memory()',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'How many grayscale values are in one flattened 28×28 MNIST image?',
    options: ['28', '56', '784', '65000'],
    correctIndex: 2,
  },
  {
    prompt: 'Why does the checked-in MNIST label file contain 650,000 bytes?',
    options: [
      '65,000 images × 10 one-hot label bytes',
      '650,000 images × one class byte',
      '28×28 pixels × 829 labels',
      'The PNG header occupies 650,000 bytes',
    ],
    correctIndex: 0,
  },
  {
    prompt: 'What image tensor shape should 100 MNIST examples have?',
    options: [
      '[100, 784]',
      '[100, 28, 28, 1]',
      '[28, 28, 100]',
      '[100, 10]',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why divide Canvas grayscale bytes by 255?',
    options: [
      'To make labels one-hot',
      'To normalize pixel values into the 0..1 range',
      'To reduce 28 pixels to 24',
      'To create a batch dimension',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What does tf.tidy() help dispose?',
    options: [
      'Only JavaScript strings',
      'Temporary tensors created inside its function scope',
      'The browser window',
      'The long-lived model automatically after every prediction',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Why resize a 280×280 drawing Canvas before MNIST prediction?',
    options: [
      'The model expects 28×28 images',
      'Softmax requires 280×280',
      'The sprite is 280 pixels wide',
      'tf.browser.fromPixels() cannot read 280×280',
    ],
    correctIndex: 0,
  },
  {
    prompt: 'What does stable tf.memory().numTensors across repeated Canvas predictions demonstrate?',
    options: [
      'The classifier is always correct',
      'The temporary inference path is not accumulating live tensors',
      'The model has ten filters',
      'The Canvas contains no pixels',
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
