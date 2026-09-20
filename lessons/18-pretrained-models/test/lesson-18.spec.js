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
    '-m', 'http.server', '4190', '--directory', repoRoot,
  ], { stdio: 'ignore' });
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('loads a pretrained model and performs inference without training', async ({ page }) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4190/lessons/18-pretrained-models/',
  );

  await page.waitForFunction(
    () => window.__LESSON_18_RESULT__ || window.__LESSON_18_ERROR__,
    null,
    { timeout: 60000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_18_RESULT__ ?? null,
    error: window.__LESSON_18_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.modelLoaded).toBe(true);
  expect(state.result.trainedInBrowser).toBe(false);
  expect(state.result.inputs).toEqual([0, 1, 2]);
  expect(state.result.predictions).toEqual([1, 3, 5]);
  expect(errors).toEqual([]);
});
