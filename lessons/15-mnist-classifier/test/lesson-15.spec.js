import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..', '..', '..',
);

let server;

test.beforeAll(async () => {
  server = spawn('python3', [
    '-m', 'http.server', '4187', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('trains MNIST and classifies a real digit through Canvas', async ({page}) => {
  test.setTimeout(300000);

  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4187/lessons/15-mnist-classifier/',
  );

  await page.waitForFunction(
    () => window.__LESSON_15_RESULT__ || window.__LESSON_15_ERROR__,
    null,
    {timeout: 270000},
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_15_RESULT__ ?? null,
    error: window.__LESSON_15_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.trainingExamples).toBe(3000);
  expect(state.result.heldOutExamples).toBe(500);
  expect(state.result.epochs).toBe(3);
  expect(Number.isFinite(state.result.finalTrainingLoss)).toBe(true);
  expect(state.result.heldOutAccuracy).toBeGreaterThanOrEqual(0.81);
  expect(state.result.canvasPrediction).toBe(
    state.result.expectedCanvasClass,
  );
  expect(state.result.canvasProbabilitySum).toBeCloseTo(1, 4);
  expect(state.result.memoryAfterRepeatedInference).toBe(
    state.result.memoryBeforeRepeatedInference,
  );
  expect(state.result.chartCount).toBeGreaterThan(0);
  expect(errors).toEqual([]);

  await expect(
    page.getByRole('button', {name: 'Classify drawing'}),
  ).toBeEnabled();
});
