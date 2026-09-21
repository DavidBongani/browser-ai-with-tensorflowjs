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
    server.listen(4191, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve =>
    server.close(resolve),
  );
});

test('shows true false and null threshold outcomes', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:4191/lessons/19-toxicity-classifier/',
  );

  await page.waitForFunction(
    () => window.__LESSON_19_RESULT__,
  );

  const initial = await page.evaluate(
    () => window.__LESSON_19_RESULT__,
  );

  expect(initial.threshold).toBe(0.9);
  expect(
    initial.predictions.map(item => item.match),
  ).toEqual([true, false, null]);

  await page.locator('#threshold').fill('0.95');

  await expect
    .poll(async () =>
      page.evaluate(
        () => window.__LESSON_19_RESULT__.threshold,
      ),
    )
    .toBe(0.95);

  const updated = await page.evaluate(
    () => window.__LESSON_19_RESULT__,
  );

  expect(updated.predictions[0].match).toBeNull();
  expect(updated.predictions[1].match).toBe(false);
});
