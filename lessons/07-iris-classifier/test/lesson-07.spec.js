import {
  test,
  expect,
} from '@playwright/test';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);

let server;

test.beforeAll(async () => {
  server = spawn(
    'python3',
    [
      '-m',
      'http.server',
      '4179',
      '--directory',
      repoRoot,
    ],
    { stdio: 'ignore' },
  );

  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => {
  server?.kill();
});

test('trains the Iris classifier and predicts a held-out-style flower', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.goto(
    'http://127.0.0.1:4179/lessons/07-iris-classifier/',
  );

  await page.waitForFunction(
    () => window.__LESSON_07_RESULT__ || window.__LESSON_07_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_07_RESULT__ ?? null,
    error: window.__LESSON_07_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.trainingExamples).toBe(120);
  expect(state.result.heldOutExamples).toBe(30);
  expect(Number.isFinite(state.result.finalTrainingLoss)).toBe(true);
  expect(state.result.heldOutAccuracy).toBeGreaterThanOrEqual(0.90);
  expect(state.result.samplePrediction.species).toBe('Iris-setosa');
  expect(
    state.result.samplePrediction.probabilities.reduce(
      (sum, value) => sum + value,
      0,
    ),
  ).toBeCloseTo(1, 4);
  expect(errors).toEqual([]);
});
