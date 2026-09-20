import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname =
  path.dirname(
    fileURLToPath(import.meta.url),
  );

const lessonDir =
  path.resolve(
    __dirname,
    '..',
  );

let server;

test.beforeAll(async () => {
  server = spawn(
    'python3',
    [
      '-m',
      'http.server',
      '4173',
      '--directory',
      lessonDir,
    ],
    {
      stdio: 'ignore',
    },
  );

  await new Promise(
    resolve =>
      setTimeout(resolve, 1000),
  );
});

test.afterAll(() => {
  server?.kill();
});

test('trains and predicts approximately 21 for x=10', async ({ page }) => {
  const consoleErrors = [];

  page.on(
    'console',
    message => {
      if (message.type() === 'error') {
        consoleErrors.push(
          message.text(),
        );
      }
    },
  );

  await page.goto(
    'http://127.0.0.1:4173',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_01_RESULT__
      || window.__LESSON_01_ERROR__,
    null,
    {
      timeout: 120000,
    },
  );

  const state =
    await page.evaluate(
      () => ({
        result:
          window.__LESSON_01_RESULT__
          ?? null,
        error:
          window.__LESSON_01_ERROR__
          ?? null,
      }),
    );

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.finalLoss).toBeLessThan(0.02);
  expect(state.result.predictedYFor10).toBeGreaterThan(20);
  expect(state.result.predictedYFor10).toBeLessThan(22);
  expect(consoleErrors).toEqual([]);
});
