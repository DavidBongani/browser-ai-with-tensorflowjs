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
    server.listen(4197, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('shows converter commands and generated artifact paths', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:4197/lessons/25-converting-models-to-javascript/',
  );

  await page.waitForFunction(
    () => window.__LESSON_25_RESULT__,
  );

  let result = await page.evaluate(
    () => window.__LESSON_25_RESULT__,
  );

  expect(result.kind).toBe('keras');
  expect(result.command).toContain('--input_format=keras');
  expect(result.artifacts.manifest)
    .toBe('./web_model/model.json');

  await page.locator('#format').selectOption('savedModel');

  await expect
    .poll(async () =>
      page.evaluate(
        () => window.__LESSON_25_RESULT__.kind,
      ),
    )
    .toBe('savedModel');

  result = await page.evaluate(
    () => window.__LESSON_25_RESULT__,
  );

  expect(result.command)
    .toContain('--input_format=tf_saved_model');
  expect(result.command)
    .toContain('--output_format=tfjs_graph_model');
});
