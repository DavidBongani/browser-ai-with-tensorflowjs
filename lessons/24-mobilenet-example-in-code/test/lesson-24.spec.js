import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
let server;

test.beforeAll(async () => {
  server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    const relativePath = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
    const filePath = path.join(repoRoot, relativePath.replace(/^\//, ''));
    try {
      const body = await fs.readFile(filePath);
      response.statusCode = 200;
      response.setHeader('Content-Type', filePath.endsWith('.js') ? 'text/javascript' : 'text/html');
      response.end(body);
    } catch {
      response.statusCode = 404;
      response.end('Not found');
    }
  });
  await new Promise(resolve => server.listen(4196, '127.0.0.1', resolve));
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('runs the complete MobileNet code example', async ({ page }) => {
  await page.goto('http://127.0.0.1:4196/lessons/24-mobilenet-example-in-code/');
  await page.waitForFunction(
    () => window.__LESSON_24_RESULT__ || window.__LESSON_24_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_24_RESULT__ ?? null,
    error: window.__LESSON_24_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.predictions).toHaveLength(3);
  expect(state.result.renderedCount).toBe(3);
  await expect(page.locator('#output li')).toHaveCount(3);
});
