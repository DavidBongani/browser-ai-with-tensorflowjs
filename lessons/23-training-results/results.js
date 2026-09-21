export function rankPredictions(predictions) {
  return [...predictions]
    .sort((a, b) => b.probability - a.probability)
    .map((prediction, index) => ({
      rank: index + 1,
      className: prediction.className,
      probability: prediction.probability,
      percent: prediction.probability * 100,
    }));
}

export function confidenceGap(predictions) {
  const ranked = rankPredictions(predictions);
  if (ranked.length < 2) return null;
  return ranked[0].probability - ranked[1].probability;
}
