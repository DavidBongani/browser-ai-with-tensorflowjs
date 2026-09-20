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
    '-m', 'http.server', '4189', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('trains a real Fashion-MNIST classifier in the browser', async ({page}) => {
  test.setTimeout(360000);
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4189/lessons/17-fashion-mnist-classifier/',
  );

  await page.waitForFunction(
    () => window.__LESSON_17_RESULT__ || window.__LESSON_17_ERROR__,
    null,
    {timeout: 330000},
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_17_RESULT__ ?? null,
    error: window.__LESSON_17_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.trainingExamples).toBe(3000);
  expect(state.result.heldOutExamples).toBe(500);
  expect(state.result.trainShape).toEqual([3000, 28, 28, 1]);
  expect(state.result.trainLabelShape).toEqual([3000, 10]);
  expect(state.result.testShape).toEqual([500, 28, 28, 1]);
  expect(state.result.epochs).toBe(4);
  expect(Number.isFinite(state.result.finalTrainingLoss)).toBe(true);
  expect(state.result.heldOutAccuracy).toBeGreaterThanOrEqual(0.70);
  expect(state.result.expectedClass).toBeGreaterThanOrEqual(0);
  expect(state.result.expectedClass).toBeLessThan(10);
  expect(state.result.predictedClass).toBeGreaterThanOrEqual(0);
  expect(state.result.predictedClass).toBeLessThan(10);
  expect(state.result.probabilitySum).toBeCloseTo(1, 4);
  expect(state.result.chartCount).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
