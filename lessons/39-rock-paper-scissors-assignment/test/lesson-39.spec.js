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
    server.listen(4207, '127.0.0.1', resolve),
  );
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('completes a scored three-round assignment and resets', async ({ page }) => {
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
    'http://127.0.0.1:4207/lessons/39-rock-paper-scissors-assignment/',
  );

  await page.locator('#train').click();

  await page.waitForFunction(
    () =>
      window.__LESSON_39_TRAINING__ ||
      window.__LESSON_39_ERROR__,
    null,
    { timeout: 120000 },
  );

  for (const move of ['rock', 'paper', 'rock']) {
    const priorLength = await page.evaluate(
      () => window.__LESSON_39_STATE__.history.length,
    );

    await page.locator(
      `[data-move="${move}"]`,
    ).click();

    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            window.__LESSON_39_STATE__.history.length,
        ),
      )
      .toBe(priorLength + 1);
  }

  let state = await page.evaluate(() => ({
    state: window.__LESSON_39_STATE__,
    error: window.__LESSON_39_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(errors).toEqual([]);
  expect(state.state.score).toEqual({
    player: 1,
    computer: 1,
    draws: 1,
  });
  expect(state.state.history).toHaveLength(3);

  await expect(page.locator('#score'))
    .toHaveText('Player 1 — Computer 1 — Draws 1');

  await page.locator('#reset').click();

  state = await page.evaluate(() => ({
    state: window.__LESSON_39_STATE__,
    error: window.__LESSON_39_ERROR__ ?? null,
  }));

  expect(state.error).toBeNull();
  expect(state.state.score).toEqual({
    player: 0,
    computer: 0,
    draws: 0,
  });
  expect(state.state.history).toEqual([]);

  await expect(page.locator('#history li'))
    .toHaveCount(0);
});
