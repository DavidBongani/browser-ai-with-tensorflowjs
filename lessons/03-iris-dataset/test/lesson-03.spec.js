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
      '4175',
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

test('loads and summarizes the real Iris dataset in the browser', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.goto(
    'http://127.0.0.1:4175/lessons/03-iris-dataset/',
  );

  await page.waitForFunction(
    () => window.__LESSON_03_RESULT__ || window.__LESSON_03_ERROR__,
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_03_RESULT__ ?? null,
    error: window.__LESSON_03_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.rowCount).toBe(150);
  expect(state.result.featureCount).toBe(4);
  expect(state.result.classCounts['Iris-setosa']).toBe(50);
  expect(state.result.classCounts['Iris-versicolor']).toBe(50);
  expect(state.result.classCounts['Iris-virginica']).toBe(50);
  expect(errors).toEqual([]);
});
