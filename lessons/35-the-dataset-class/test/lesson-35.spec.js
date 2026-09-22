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
  await new Promise(resolve => server.close(resolve));
});

test('materializes captured examples as training tensors', async ({ page }) => {
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
    'http://127.0.0.1:4204/lessons/35-the-dataset-class/',
  );

  const initial = await page.evaluate(
    () => window.__LESSON_35_DATASET__,
  );

  expect(initial).toEqual({
    size: 6,
    counts: [2, 2, 2],
    embeddingSize: 4,
    canTrain: true,
  });

  await page.locator('#build').click();

  await page.waitForFunction(
    () =>
      window.__LESSON_35_RESULT__ ||
      window.__LESSON_35_ERROR__,
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_35_RESULT__ ?? null,
    error: window.__LESSON_35_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.result).toEqual({
    size: 6,
    counts: [2, 2, 2],
    embeddingSize: 4,
    canTrain: true,
    xsShape: [6, 4],
    ysShape: [6, 3],
  });
});
