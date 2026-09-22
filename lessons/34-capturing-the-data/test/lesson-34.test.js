import { describe, expect, test } from 'vitest';
import {
  countExamples,
  validateClassId,
} from '../capture.js';

describe('Lesson 34 capture helpers', () => {
  test('validates class ids', () => {
    expect(() => validateClassId(0, 3))
      .not.toThrow();
    expect(() => validateClassId(2, 3))
      .not.toThrow();
    expect(() => validateClassId(3, 3))
      .toThrow(/outside/);
    expect(() => validateClassId(-1, 3))
      .toThrow(/outside/);
  });

  test('counts captured examples by class', () => {
    const examples = [
      { classId: 0 },
      { classId: 2 },
      { classId: 0 },
      { classId: 1 },
    ];

    expect(
      countExamples(examples, 3),
    ).toEqual([2, 1, 1]);
  });

  test('capture implementation disposes temporary embeddings', async () => {
    const source = await import('node:fs/promises')
      .then(fs =>
        fs.readFile(
          new URL('../capture.js', import.meta.url),
          'utf8',
        ),
      );

    expect(source).toContain('featureExtractor.infer(');
    expect(source).toContain('await embedding.data()');
    expect(source).toContain('embedding.dispose()');
  });
});
