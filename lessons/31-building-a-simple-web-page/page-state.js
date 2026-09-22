export function createPageState(classCount = 3) {
  if (!Number.isInteger(classCount) || classCount < 2) {
    throw new Error('classCount must be an integer of at least 2.');
  }

  return {
    cameraReady: false,
    trained: false,
    counts: Array(classCount).fill(0),
  };
}

export function addExample(state, classId) {
  if (
    !Number.isInteger(classId) ||
    classId < 0 ||
    classId >= state.counts.length
  ) {
    throw new Error('Invalid class id.');
  }

  state.counts[classId] += 1;
  state.trained = false;
  return state;
}

export function canTrain(state) {
  return state.counts.every(count => count > 0);
}

export function markTrained(state) {
  if (!canTrain(state)) {
    throw new Error(
      'At least one example is required for every class.',
    );
  }

  state.trained = true;
  return state;
}
