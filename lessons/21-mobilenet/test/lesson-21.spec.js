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
    server.listen(4193, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('compares standard and depthwise separable convolutions', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:4193/lessons/21-mobilenet/',
  );

  await page.waitForFunction(
    () => window.__LESSON_21_RESULT__,
  );

  const result = await page.evaluate(
    () => window.__LESSON_21_RESULT__,
  );

  expect(result.standard).toBe(18432);
  expect(result.depthwise).toBe(288);
  expect(result.pointwise).toBe(2048);
  expect(result.separable).toBe(2336);
  expect(result.parameterReductionPercent).toBeGreaterThan(87);
});
