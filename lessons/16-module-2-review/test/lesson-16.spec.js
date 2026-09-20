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
    '-m', 'http.server', '4188', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('renders and scores the Module 2 self-check', async ({page}) => {
  await page.goto(
    'http://127.0.0.1:4188/lessons/16-module-2-review/',
  );

  await page.waitForFunction(
    () => window.__LESSON_16_READY__,
  );

  await expect(page.locator('fieldset')).toHaveCount(12);

  const answers = [2, 1, 1, 1, 1, 2, 0, 1, 1, 1, 0, 1];

  for (let index = 0; index < answers.length; index += 1) {
    await page.locator(
      'input[name="question-' + index + '"][value="' + answers[index] + '"]',
    ).check();
  }

  await page.getByRole('button', {name: 'Score answers'}).click();

  const result = await page.evaluate(
    () => window.__LESSON_16_RESULT__,
  );

  expect(result.correct).toBe(12);
  expect(result.total).toBe(12);
});
