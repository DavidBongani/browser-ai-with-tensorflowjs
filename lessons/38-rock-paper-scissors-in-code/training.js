export async function trainClassifier(
  model,
  xs,
  ys,
  {
    epochs = 60,
    batchSize = xs.shape[0],
    shuffle = false,
  } = {},
) {
  if (xs.rank !== 2 || ys.rank !== 2) {
    throw new Error('Training tensors must both be rank 2.');
  }

  if (xs.shape[0] !== ys.shape[0]) {
    throw new Error(
      'Features and labels must contain the same examples.',
    );
  }

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

  return {
    epochs,
    batchSize,
    shuffle,
    initialLoss: losses[0],
    finalLoss: losses.at(-1),
    finalAccuracy:
      accuracyHistory.length > 0
        ? Number(accuracyHistory.at(-1))
        : null,
  };
}
