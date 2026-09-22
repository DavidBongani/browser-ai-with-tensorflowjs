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
  await new Promise(resolve => server.close(resolve));
});

test('captures one MobileNet embedding for each class', async ({ page }) => {
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
    'http://127.0.0.1:4203/lessons/34-capturing-the-data/',
  );

  await page.waitForFunction(
    () =>
      window.__LESSON_34_STATE__?.ready ||
      window.__LESSON_34_ERROR__,
    null,
    { timeout: 120000 },
  );

  let state = await page.evaluate(() => ({
    state: window.__LESSON_34_STATE__ ?? null,
    error: window.__LESSON_34_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.state.counts).toEqual([0, 0, 0]);

  for (const classId of [0, 1, 2]) {
    await page.locator(
      `[data-class-id="${classId}"]`,
    ).click();

    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            window.__LESSON_34_STATE__.exampleCount,
        ),
      )
      .toBe(classId + 1);
  }

  state = await page.evaluate(() => ({
    state: window.__LESSON_34_STATE__,
    error: window.__LESSON_34_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.state.counts).toEqual([1, 1, 1]);
  expect(state.state.exampleCount).toBe(3);
  expect(state.state.embeddingSizes).toHaveLength(3);
  expect(
    new Set(state.state.embeddingSizes).size,
  ).toBe(1);
  expect(state.state.embeddingSizes[0])
    .toBeGreaterThan(100);

  await expect(page.locator('#counts'))
    .toHaveText('1 / 1 / 1');
});
