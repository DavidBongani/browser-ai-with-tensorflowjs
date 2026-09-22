export function validateTrainingData(xs, ys) {
  if (xs.rank !== 2) {
    throw new Error('Feature tensor must be rank 2.');
  }

  if (ys.rank !== 2) {
    throw new Error('Label tensor must be rank 2.');
  }

  if (xs.shape[0] !== ys.shape[0]) {
    throw new Error(
      'Features and labels must contain the same number of examples.',
    );
  }

  if (xs.shape[0] < 1) {
    throw new Error('At least one training example is required.');
  }
}

export async function trainClassifier(
  model,
  xs,
  ys,
  {
    epochs = 40,
    batchSize = xs.shape[0],
    shuffle = false,
  } = {},
) {
  validateTrainingData(xs, ys);

  const history = await model.fit(
    xs,
    ys,
    {
      epochs,
      batchSize,
      shuffle,
      verbose: 0,
    },
  );

  const losses = history.history.loss.map(Number);

  const accuracyHistory =
    history.history.acc ??
    history.history.accuracy ??
    [];

  const accuracies =
    accuracyHistory.map(Number);

  return {
    epochs,
    batchSize,
    shuffle,
    initialLoss: losses[0],
    finalLoss: losses.at(-1),
    finalAccuracy:
      accuracies.length > 0
        ? accuracies.at(-1)
        : null,
  };
}
