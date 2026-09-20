import {
  test,
  expect,
} from '@playwright/test';

import path from 'node:path';
import {
  fileURLToPath,
} from 'node:url';
import {
  spawn,
} from 'node:child_process';

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
      '4182',
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

test('builds and runs the CNN in the browser', async ({ page }) => {
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
    'http://127.0.0.1:4182/lessons/10-convolutional-net/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_10_RESULT__
      || window.__LESSON_10_ERROR__,
  );

  const state =
    await page.evaluate(
      () => ({
        result:
          window.__LESSON_10_RESULT__
          ?? null,
        error:
          window.__LESSON_10_ERROR__
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
    state.result.inputShape,
  ).toEqual(
    [null, 28, 28, 1],
  );

  expect(
    state.result.outputShape,
  ).toEqual(
    [null, 10],
  );

  expect(
    state.result.predictionShape,
  ).toEqual(
    [1, 10],
  );

  expect(
    errors,
  ).toEqual([]);
});
