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
    '-m', 'http.server', '4186', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('shows temporary tensor growth and tidy stability', async ({page}) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4186/lessons/14-tidy-memory/',
  );

  await page.waitForFunction(
    () => window.__LESSON_14_RESULT__ || window.__LESSON_14_ERROR__,
    null,
    {timeout: 60000},
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_14_RESULT__ ?? null,
    error: window.__LESSON_14_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.temporaryIncrease).toBeGreaterThanOrEqual(80);
  expect(state.result.afterManualCleanup).toBe(state.result.baseline);
  expect(state.result.afterTidyLoop).toBe(state.result.afterManualCleanup);
  expect(state.result.tidyStable).toBe(true);
  expect(errors).toEqual([]);
});
