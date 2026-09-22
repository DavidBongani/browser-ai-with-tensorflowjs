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
    server.listen(4201, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('matches Python and browser outputs in the conversion lab', async ({ page }) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(
    'http://127.0.0.1:4201/lessons/29-python-model-conversion-lab/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_29_RESULT__ ||
      window.__LESSON_29_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_29_RESULT__ ?? null,
    error: window.__LESSON_29_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.modelName).toBe('lesson_29_lab');
  expect(state.result.input).toEqual([3, 4]);
  expect(state.result.pythonOutput).toEqual([7, -1]);
  expect(state.result.browserOutput).toEqual([7, -1]);
  expect(state.result.maxDelta).toBeLessThanOrEqual(1e-6);

  await expect(page.locator('#prediction'))
    .toHaveText('[7,-1]');
});
