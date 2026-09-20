import {
  test,
  expect,
} from '@playwright/test';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const repoRoot =
  path.resolve(
    path.dirname(
      fileURLToPath(
        import.meta.url,
      ),
    ),
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
      '4181',
      '--directory',
      repoRoot,
    ],
    {
      stdio:
        'ignore',
    },
  );

  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        1000,
      ),
  );
});

test.afterAll(() => {
  server?.kill();
});

test('trains the breast cancer classifier in the browser', async ({ page }) => {
  const errors = [];

  page.on(
    'console',
    message => {
      if (
        message.type()
        === 'error'
      ) {
        errors.push(
          message.text(),
        );
      }
    },
  );

  await page.goto(
    'http://127.0.0.1:4181/lessons/09-breast-cancer-classification/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_09_RESULT__
      || window.__LESSON_09_ERROR__,
    null,
    {
      timeout:
        120000,
    },
  );

  const state =
    await page.evaluate(
      () => ({
        result:
          window.__LESSON_09_RESULT__
          ?? null,
        error:
          window.__LESSON_09_ERROR__
          ?? null,
      }),
    );

  expect(
    state.error,
  ).toBeNull();

  expect(
    state.result.tensorflowJs,
  ).toBe('4.22.0');

  expect(
    state.result.rowCount,
  ).toBe(569);

  expect(
    state.result.featureCount,
  ).toBe(30);

  expect(
    state.result.trainingExamples
    + state.result.heldOutExamples,
  ).toBe(569);

  expect(
    state.result.heldOutAccuracy,
  ).toBeGreaterThanOrEqual(
    0.90,
  );

  expect(
    state.result.benignPrediction
      .predictedDiagnosis,
  ).toBe('B');

  expect(
    state.result.malignantPrediction
      .predictedDiagnosis,
  ).toBe('M');

  expect(
    errors,
  ).toEqual([]);
});
