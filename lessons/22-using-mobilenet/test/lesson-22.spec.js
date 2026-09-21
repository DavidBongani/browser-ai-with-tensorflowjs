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
  await new Promise(resolve => server.listen(4194, '127.0.0.1', resolve));
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('loads real MobileNet and classifies canvas pixels', async ({ page }) => {
  await page.goto('http://127.0.0.1:4194/lessons/22-using-mobilenet/');
  await page.waitForFunction(
    () => window.__LESSON_22_READY__ || window.__LESSON_22_ERROR__,
    null,
    { timeout: 120000 },
  );

  expect(await page.evaluate(() => window.__LESSON_22_ERROR__ ?? null)).toBeNull();

  await page.locator('#classify').click();
  await page.waitForFunction(
    () => window.__LESSON_22_RESULT__ || window.__LESSON_22_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_22_RESULT__ ?? null,
    error: window.__LESSON_22_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.predictions).toHaveLength(3);
  for (const prediction of state.result.predictions) {
    expect(typeof prediction.className).toBe('string');
    expect(Number.isFinite(prediction.probability)).toBe(true);
  }
});
