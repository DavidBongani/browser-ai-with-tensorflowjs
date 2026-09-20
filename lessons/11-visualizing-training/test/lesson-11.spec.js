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
    '-m', 'http.server', '4183', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('renders live tfjs-vis training charts', async ({page}) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4183/lessons/11-visualizing-training/',
  );

  await page.waitForFunction(
    () => window.__LESSON_11_RESULT__ || window.__LESSON_11_ERROR__,
    null,
    {timeout: 120000},
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_11_RESULT__ ?? null,
    error: window.__LESSON_11_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.tfjsVisLoaded).toBe(true);
  expect(state.result.epochCount).toBe(8);
  expect(state.result.loss.every(Number.isFinite)).toBe(true);
  expect(state.result.accuracy.every(Number.isFinite)).toBe(true);
  expect(
    state.result.chartSvgCount + state.result.chartCanvasCount,
  ).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
