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
      '4178',
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

test('builds the four-input three-output Iris classifier in the browser', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.goto(
    'http://127.0.0.1:4178/lessons/06-designing-iris-network/',
  );

  await page.waitForFunction(
    () => window.__LESSON_06_RESULT__ || window.__LESSON_06_ERROR__,
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_06_RESULT__ ?? null,
    error: window.__LESSON_06_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.inputShape).toEqual([null, 4]);
  expect(state.result.outputShape).toEqual([null, 3]);
  expect(state.result.layers[0].activation).toBe('relu');
  expect(state.result.layers[1].activation).toBe('softmax');
  expect(errors).toEqual([]);
});
