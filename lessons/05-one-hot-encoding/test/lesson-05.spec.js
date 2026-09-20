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
      '4177',
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

test('encodes all Iris labels into three-class one-hot vectors', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.goto(
    'http://127.0.0.1:4177/lessons/05-one-hot-encoding/',
  );

  await page.waitForFunction(
    () => window.__LESSON_05_RESULT__ || window.__LESSON_05_ERROR__,
    null,
    { timeout: 60000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_05_RESULT__ ?? null,
    error: window.__LESSON_05_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.labelCount).toBe(150);
  expect(state.result.shape).toEqual([150, 3]);
  expect(state.result.examples.setosa).toEqual([1, 0, 0]);
  expect(state.result.examples.versicolor).toEqual([0, 1, 0]);
  expect(state.result.examples.virginica).toEqual([0, 0, 1]);
  expect(state.result.everyRowHasOneActiveClass).toBe(true);
  expect(errors).toEqual([]);
});
