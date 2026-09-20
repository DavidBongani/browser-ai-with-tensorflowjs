import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: [
    'tests/browser/**/*.spec.js',
    'lessons/**/*.spec.js',
    'labs/**/*.spec.js',
  ],
  testIgnore: [
    '**/node_modules/**',
  ],
  use: {
    headless: true,
  },
});
