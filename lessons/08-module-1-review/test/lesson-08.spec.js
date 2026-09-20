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
      '4180',
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

test('renders and scores the Module 1 self-check', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:4180/lessons/08-module-1-review/',
  );

  await page.waitForFunction(
    () => window.__LESSON_08_READY__,
  );

  const count = await page.evaluate(
    () =>
      window.__LESSON_08_READY__
        .questionCount,
  );

  expect(count).toBe(12);

  const fieldsets =
    page.locator('fieldset');

  await expect(
    fieldsets,
  ).toHaveCount(12);

  const correctIndexes = [
    1, 1, 1, 1,
    2, 1, 2, 1,
    1, 1, 1, 1,
  ];

  for (
    let index = 0;
    index < correctIndexes.length;
    index += 1
  ) {
    await page
      .locator(
        'input[name="question-'
        + index
        + '"][value="'
        + correctIndexes[index]
        + '"]',
      )
      .check();
  }

  await page
    .getByRole(
      'button',
      {
        name:
          'Score answers',
      },
    )
    .click();

  const score =
    await page.evaluate(
      () =>
        window.__LESSON_08_RESULT__,
    );

  expect(score.correct).toBe(12);
  expect(score.total).toBe(12);
});
