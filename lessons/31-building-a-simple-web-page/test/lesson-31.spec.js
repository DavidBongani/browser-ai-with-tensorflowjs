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
    server.listen(4203, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  server.closeAllConnections?.();
  await new Promise(resolve => server.close(resolve));
});

test('wires the transfer-learning page controls', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:4203/lessons/31-building-a-simple-web-page/',
  );

  await expect(page.locator('#webcam')).toHaveAttribute(
    'width',
    '224',
  );
  await expect(page.locator('[data-class-id]')).toHaveCount(3);
  await expect(page.locator('#counts')).toHaveText('0 / 0 / 0');
  await expect(page.locator('#train')).toBeDisabled();
  await expect(page.locator('#predict')).toBeDisabled();

  await page.locator('[data-class-id="0"]').click();
  await page.locator('[data-class-id="1"]').click();
  await page.locator('[data-class-id="2"]').click();

  await expect(page.locator('#counts')).toHaveText('1 / 1 / 1');
  await expect(page.locator('#train')).toBeEnabled();

  await page.locator('#train').click();
  await expect(page.locator('#predict')).toBeEnabled();

  const state = await page.evaluate(
    () => window.__LESSON_31_STATE__,
  );

  expect(state.counts).toEqual([1, 1, 1]);
  expect(state.trained).toBe(true);
});
