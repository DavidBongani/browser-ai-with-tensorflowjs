export const QUESTIONS = [
  {
    prompt: 'How many numeric input features describe one Iris flower?',
    options: ['3', '4', '8', '150'],
    correctIndex: 1,
  },
  {
    prompt: 'Which Iris CSV column is the target label?',
    options: ['petal_width', 'species', 'sepal_length', 'sepal_width'],
    correctIndex: 1,
  },
  {
    prompt: 'What does isLabel: true tell tf.data.csv()?',
    options: [
      'Ignore the column',
      'Use the column as a target',
      'Convert the column to an image',
      'Shuffle the column',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'With the book class order, which class is index 1?',
    options: [
      'Iris-setosa',
      'Iris-versicolor',
      'Iris-virginica',
      'No class',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'What is the one-hot target for Iris-virginica?',
    options: [
      '[1, 0, 0]',
      '[0, 1, 0]',
      '[0, 0, 1]',
      '[1, 1, 1]',
    ],
    correctIndex: 2,
  },
  {
    prompt: 'What is the one-hot target tensor shape for all 150 Iris examples?',
    options: ['[150, 4]', '[150, 3]', '[3, 150]', '[4, 3]'],
    correctIndex: 1,
  },
  {
    prompt: 'Why does the Iris output layer use 3 units?',
    options: [
      'There are 3 training epochs',
      'There are 3 input measurements',
      'There are 3 target classes',
      'Softmax always needs 3 units',
    ],
    correctIndex: 2,
  },
  {
    prompt: 'Which output activation is used for the three mutually exclusive Iris classes?',
    options: ['relu', 'softmax', 'linear', 'tanh'],
    correctIndex: 1,
  },
  {
    prompt: 'Which loss matches the one-hot multiclass targets in this module?',
    options: [
      'meanSquaredError',
      'categoricalCrossentropy',
      'binaryCrossentropy',
      'absoluteDifference',
    ],
    correctIndex: 1,
  },
  {
    prompt: 'Which operation changes model parameters using training examples?',
    options: ['model.predict()', 'model.fit()', 'tf.oneHot()', 'tf.ready()'],
    correctIndex: 1,
  },
  {
    prompt: 'Which operation uses the trained model to produce a prediction?',
    options: ['model.fit()', 'model.predict()', 'model.compile()', 'tf.data.csv()'],
    correctIndex: 1,
  },
  {
    prompt: 'Why should the Iris class order remain stable?',
    options: [
      'It makes the CSV shorter',
      'Output indexes only retain meaning when encoding and decoding agree',
      'It changes the number of features',
      'TensorFlow.js sorts classes automatically',
    ],
    correctIndex: 1,
  },
];

export function scoreResponses(responses) {
  if (
    !Array.isArray(responses)
    || responses.length !== QUESTIONS.length
  ) {
    throw new Error(
      'One response is required for every question.',
    );
  }

  const results =
    QUESTIONS.map(
      (question, index) => ({
        correct:
          responses[index]
          === question.correctIndex,
        selected:
          responses[index],
        correctIndex:
          question.correctIndex,
      }),
    );

  return {
    total:
      QUESTIONS.length,
    correct:
      results.filter(
        item => item.correct,
      ).length,
    results,
  };
}
