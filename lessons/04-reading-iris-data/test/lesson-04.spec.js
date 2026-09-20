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
      '4176',
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

test('tf.data.csv separates Iris features and label', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.goto(
    'http://127.0.0.1:4176/lessons/04-reading-iris-data/',
  );

  await page.waitForFunction(
    () => window.__LESSON_04_RESULT__ || window.__LESSON_04_ERROR__,
    null,
    { timeout: 60000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_04_RESULT__ ?? null,
    error: window.__LESSON_04_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.exampleCount).toBe(150);
  expect(state.result.columnNames).toEqual([
    'sepal_length',
    'sepal_width',
    'petal_length',
    'petal_width',
    'species',
  ]);
  expect(state.result.featureNames).toEqual([
    'sepal_length',
    'sepal_width',
    'petal_length',
    'petal_width',
  ]);
  expect(state.result.labelNames).toEqual([
    'species',
  ]);
  expect(state.result.firstExample.ys.species).toBe('Iris-setosa');
  expect(errors).toEqual([]);
});
