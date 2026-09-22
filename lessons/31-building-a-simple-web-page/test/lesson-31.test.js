import { describe, expect, test } from 'vitest';
import {
  addExample,
  canTrain,
  createPageState,
  markTrained,
} from '../page-state.js';

describe('Lesson 31 transfer-learning page state', () => {
  test('starts with three empty classes', () => {
    const state = createPageState(3);

    expect(state.counts).toEqual([0, 0, 0]);
    expect(state.cameraReady).toBe(false);
    expect(state.trained).toBe(false);
    expect(canTrain(state)).toBe(false);
  });

  test('requires an example from every class before training', () => {
    const state = createPageState(3);

    addExample(state, 0);
    addExample(state, 1);
    expect(canTrain(state)).toBe(false);

    addExample(state, 2);
    expect(canTrain(state)).toBe(true);
  });

  test('new examples invalidate a previously trained classifier', () => {
    const state = createPageState(3);

    addExample(state, 0);
    addExample(state, 1);
    addExample(state, 2);
    markTrained(state);

    expect(state.trained).toBe(true);

    addExample(state, 0);
    expect(state.trained).toBe(false);
  });
});
