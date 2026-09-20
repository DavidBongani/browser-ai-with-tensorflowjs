import {
  describe,
  expect,
  it,
} from 'vitest';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseIrisCsv,
  summarizeIris,
} from '../iris.js';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);

describe('Iris dataset', () => {
  it('contains the expected examples, features and classes', () => {
    const csv = fs.readFileSync(
      path.join(
        repoRoot,
        'shared',
        'datasets',
        'iris.csv',
      ),
      'utf8',
    );

    const { rows } = parseIrisCsv(csv);
    const summary = summarizeIris(rows);

    expect(summary.rowCount).toBe(150);
    expect(summary.featureCount).toBe(4);
    expect(summary.classCounts).toEqual({
      'Iris-setosa': 50,
      'Iris-versicolor': 50,
      'Iris-virginica': 50,
    });

    expect(
      rows.every(
        row =>
          row.features.length === 4
          && row.features.every(Number.isFinite),
      ),
    ).toBe(true);
  });
});
