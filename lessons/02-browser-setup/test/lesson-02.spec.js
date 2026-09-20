import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

let server;

test.beforeAll(async () => {
  server = spawn(
    'python3',
    ['-m', 'http.server', '4174', '--directory', lessonDir],
    { stdio: 'ignore' },
  );

  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.afterAll(() => {
  server?.kill();
});

test('loads TensorFlow.js from a local web server', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await page.goto('http://127.0.0.1:4174');

  await page.waitForFunction(
    () => window.__LESSON_02_RESULT__ || window.__LESSON_02_ERROR__,
    null,
    { timeout: 60000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_02_RESULT__ ?? null,
    error: window.__LESSON_02_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.version).toBe('4.22.0');
  expect(typeof state.result.backend).toBe('string');
  expect(state.result.backend.length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
