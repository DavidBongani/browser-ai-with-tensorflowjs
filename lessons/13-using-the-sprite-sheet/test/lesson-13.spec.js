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
    '-m', 'http.server', '4185', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('turns real MNIST sprite rows into normalized tensors', async ({page}) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4185/lessons/13-using-the-sprite-sheet/',
  );

  await page.waitForFunction(
    () => window.__LESSON_13_RESULT__ || window.__LESSON_13_ERROR__,
    null,
    {timeout: 120000},
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_13_RESULT__ ?? null,
    error: window.__LESSON_13_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.xsShape).toEqual([100, 28, 28, 1]);
  expect(state.result.ysShape).toEqual([100, 10]);
  expect(state.result.minPixel).toBeGreaterThanOrEqual(0);
  expect(state.result.maxPixel).toBeLessThanOrEqual(1);
  expect(state.result.maxPixel).toBeGreaterThan(0);
  expect(state.result.firstLabel).toHaveLength(10);
  expect(state.result.firstClass).toBe(5);
  expect(state.result.everyLabelIsOneHot).toBe(true);
  expect(errors).toEqual([]);
});
