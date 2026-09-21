export const TOXICITY_LABELS = [
  'identity_attack',
  'insult',
  'obscene',
  'severe_toxicity',
  'sexual_explicit',
  'threat',
  'toxicity',
];

export function classifyProbabilityPair(
  probabilities,
  threshold,
) {
  const [notMatch, match] = probabilities;

  if (match >= threshold) return true;
  if (notMatch >= threshold) return false;
  return null;
}

export function summarizePrediction(
  label,
  probabilities,
  threshold,
) {
  return {
    label,
    probabilities,
    match: classifyProbabilityPair(
      probabilities,
      threshold,
    ),
  };
}
