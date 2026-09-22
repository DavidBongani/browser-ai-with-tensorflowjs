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

function contentType(filePath) {
  if (filePath.endsWith('.js')) return 'text/javascript';
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.bin')) return 'application/octet-stream';
  return 'text/html';
}

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
        contentType(filePath),
      );
      response.end(body);
    } catch {
      response.statusCode = 404;
      response.end('Not found');
    }
  });

  await new Promise(resolve =>
    server.listen(4199, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('matches the trained Python linear prediction in Chromium', async ({ page }) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(
    'http://127.0.0.1:4199/lessons/27-linear-example-in-code/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_27_RESULT__ ||
      window.__LESSON_27_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_27_RESULT__ ?? null,
    error: window.__LESSON_27_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.modelName).toBe('lesson_27_linear');
  expect(state.result.input).toBe(4);
  expect(state.result.browserPrediction).toBeCloseTo(13, 4);
  expect(state.result.pythonPrediction).toBeCloseTo(13, 4);
  expect(state.result.delta).toBeLessThanOrEqual(1e-5);
  expect(state.result.learnedWeight).toBeCloseTo(3, 4);
  expect(state.result.learnedBias).toBeCloseTo(1, 4);

  await expect(page.locator('#prediction'))
    .toHaveText('13.0000');
});
