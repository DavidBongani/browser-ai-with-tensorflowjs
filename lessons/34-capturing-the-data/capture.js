export function validateClassId(
  classId,
  classCount,
) {
  if (!Number.isInteger(classCount) || classCount < 2) {
    throw new Error('classCount must be an integer of at least 2.');
  }

  if (
    !Number.isInteger(classId) ||
    classId < 0 ||
    classId >= classCount
  ) {
    throw new Error('classId is outside the configured class range.');
  }
}

export async function captureExample({
  featureExtractor,
  source,
  classId,
  classCount,
}) {
  validateClassId(classId, classCount);

  const embedding = featureExtractor.infer(
    source,
    true,
  );

  try {
    if (embedding.rank !== 2 || embedding.shape[0] !== 1) {
      throw new Error(
        'Expected one rank-2 MobileNet embedding.',
      );
    }

    const featureValues = Array.from(
      await embedding.data(),
    );

    return {
      classId,
      classCount,
      featureValues,
      embeddingSize: featureValues.length,
    };
  } finally {
    embedding.dispose();
  }
}

export function countExamples(
  examples,
  classCount,
) {
  const counts = Array(classCount).fill(0);

  for (const example of examples) {
    validateClassId(
      example.classId,
      classCount,
    );
    counts[example.classId] += 1;
  }

  return counts;
}
