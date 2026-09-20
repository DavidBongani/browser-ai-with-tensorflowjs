import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'tests/**/*.test.js',
      'lessons/**/*.test.js',
      'labs/**/*.test.js',
    ],
    exclude: [
      'tests/browser/**',
      '**/node_modules/**',
    ],
  },
});
