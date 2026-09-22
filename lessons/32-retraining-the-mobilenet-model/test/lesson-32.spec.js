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
    server.listen(4204, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  server.closeAllConnections?.();
  await new Promise(resolve => server.close(resolve));
});

test('extracts a real MobileNet embedding for a new classifier', async ({ page }) => {
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
    'http://127.0.0.1:4204/lessons/32-retraining-the-mobilenet-model/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_32_RESULT__ ||
      window.__LESSON_32_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_32_RESULT__ ?? null,
    error: window.__LESSON_32_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.embeddingShape[0]).toBe(1);
  expect(state.result.embeddingSize).toBeGreaterThan(0);
  expect(state.result.classifierInputShape)
    .toEqual([null, state.result.embeddingSize]);
  expect(state.result.classifierOutputShape)
    .toEqual([null, 3]);
  expect(state.result.classCount).toBe(3);
});
