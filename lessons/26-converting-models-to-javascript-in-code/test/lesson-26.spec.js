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
    server.listen(4198, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('loads the converted model and matches Python inference', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  const fetchedArtifacts = new Set();

  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  page.on('response', response => {
    if (
      response.ok() &&
      (
        response.url().endsWith('/web-model/model.json') ||
        response.url().endsWith('/web-model/group1-shard1of1.bin')
      )
    ) {
      fetchedArtifacts.add(
        new URL(response.url()).pathname,
      );
    }
  });

  await page.goto(
    'http://127.0.0.1:4198/lessons/26-converting-models-to-javascript-in-code/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_26_RESULT__ ||
      window.__LESSON_26_ERROR__,
    null,
    { timeout: 120000 },
  );

  const state = await page.evaluate(() => ({
    result: window.__LESSON_26_RESULT__ ?? null,
    error: window.__LESSON_26_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);

  expect(state.result.tensorflowJs).toBe('4.22.0');
  expect(state.result.modelName).toBe('lesson_26_linear');
  expect(state.result.inputShape).toEqual([null, 2]);
  expect(state.result.outputShape).toEqual([null, 1]);
  expect(state.result.input).toEqual([3, 4]);
  expect(state.result.prediction).toBeCloseTo(2.5, 6);

  await expect(page.locator('#prediction'))
    .toHaveText('2.50');

  expect(
    [...fetchedArtifacts].some(pathname =>
      pathname.endsWith('/web-model/model.json'),
    ),
  ).toBe(true);

  expect(
    [...fetchedArtifacts].some(pathname =>
      pathname.endsWith('/web-model/group1-shard1of1.bin'),
    ),
  ).toBe(true);
});
