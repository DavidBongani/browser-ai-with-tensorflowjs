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
  server.closeAllConnections?.();
  await new Promise(resolve => server.close(resolve));
});

test('trains through the browser training function', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:4205/lessons/33-the-training-function/',
  );

  await page.locator('#train').click();

  await page.waitForFunction(
    () =>
      window.__LESSON_33_RESULT__ ||
      window.__LESSON_33_ERROR__,
    null,
    { timeout: 30000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_33_RESULT__ ?? null,
    error: window.__LESSON_33_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.finalLoss)
    .toBeLessThan(state.result.initialLoss);
  expect(state.result.finalAccuracy)
    .toBeGreaterThanOrEqual(0.99);
  expect(state.result.shuffle).toBe(false);

  await expect(page.locator('#status'))
    .toHaveText('Training complete.');
});
