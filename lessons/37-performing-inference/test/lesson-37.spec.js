import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..', '..', '..',
);

let server;

test.beforeAll(async () => {
  server = http.createServer(async (request, response) => {
    const pathname = new URL(
      request.url,
      'http://127.0.0.1',
    ).pathname;

    const relativePath =
      pathname.endsWith('/')
        ? pathname + 'index.html'
        : pathname;

    const filePath = path.join(
      repoRoot,
      relativePath.replace(/^\//, ''),
    );

    try {
      const body = await fs.readFile(filePath);
      response.statusCode = 200;
      response.setHeader(
        'Content-Type',
        filePath.endsWith('.js')
          ? 'text/javascript'
          : 'text/html',
      );
      response.end(body);
    } catch {
      response.statusCode = 404;
      response.end('Not found');
    }
  });

  await new Promise(resolve =>
    server.listen(4205, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('trains and predicts a new class in the browser', async ({ page }) => {
  const errors = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto(
    'http://127.0.0.1:4205/lessons/37-performing-inference/',
  );

  await page.locator('#run').click();

  await page.waitForFunction(
    () =>
      window.__LESSON_37_RESULT__ ||
      window.__LESSON_37_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_37_RESULT__ ?? null,
    error: window.__LESSON_37_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.result.prediction.className).toBe('triangle');
  expect(state.result.prediction.classId).toBe(2);
  expect(state.result.prediction.confidence).toBeGreaterThan(0.8);
  expect(state.result.training.finalLoss)
    .toBeLessThan(state.result.training.initialLoss);

  await expect(page.locator('#status'))
    .toHaveText('Prediction: triangle');
});
