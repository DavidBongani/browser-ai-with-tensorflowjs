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
    server.listen(4200, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('searches the real 1000-class MobileNet vocabulary', async ({ page }) => {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(
    'http://127.0.0.1:4200/lessons/28-supported-mobilenet-classes/',
  );

  await page.waitForFunction(
    () => window.__LESSON_28_RESULT__,
  );

  let result = await page.evaluate(
    () => window.__LESSON_28_RESULT__,
  );

  expect(result.summary.count).toBe(1000);
  expect(result.summary.first.className)
    .toBe('tench, Tinca tinca');
  expect(result.summary.middle.className)
    .toBe('coffee mug');
  expect(result.summary.last.className)
    .toBe('toilet tissue, toilet paper, bathroom tissue');

  expect(result.query).toBe('retriever');
  expect(result.matches.map(item => item.classId))
    .toEqual(expect.arrayContaining([205, 206, 207, 208, 209]));

  await page.locator('#query').fill('volcano');
  await page.locator('#search').click();

  await expect.poll(async () =>
    page.evaluate(
      () => window.__LESSON_28_RESULT__.query,
    ),
  ).toBe('volcano');

  result = await page.evaluate(
    () => window.__LESSON_28_RESULT__,
  );

  expect(result.matches).toEqual([
    {
      classId: 980,
      className: 'volcano',
    },
  ]);

  expect(errors).toEqual([]);
});
