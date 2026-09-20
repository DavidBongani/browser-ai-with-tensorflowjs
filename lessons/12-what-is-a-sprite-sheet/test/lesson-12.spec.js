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
    '-m', 'http.server', '4184', '--directory', repoRoot,
  ], {stdio: 'ignore'});
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => server?.kill());

test('inspects the real local MNIST sprite and reconstructs one digit', async ({page}) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(
    'http://127.0.0.1:4184/lessons/12-what-is-a-sprite-sheet/',
  );

  await page.waitForFunction(
    () => window.__LESSON_12_RESULT__ || window.__LESSON_12_ERROR__,
    null,
    {timeout: 120000},
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_12_RESULT__ ?? null,
    error: window.__LESSON_12_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.spriteWidth).toBe(784);
  expect(state.result.spriteHeight).toBe(65000);
  expect(state.result.flattenedPixelsPerImage).toBe(784);
  expect(state.result.datasetSize).toBe(65000);
  expect(state.result.labelBytes).toBe(650000);
  expect(state.result.firstLabel).toHaveLength(10);
  expect(
    state.result.firstLabel.reduce((sum, value) => sum + value, 0),
  ).toBe(1);
  expect(state.result.reconstructedCanvas).toEqual({
    width: 28,
    height: 28,
  });
  expect(errors).toEqual([]);
});
