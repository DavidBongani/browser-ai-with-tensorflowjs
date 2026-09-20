import {
  describe,
  expect,
  it,
} from 'vitest';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  fitMinMax,
  parseBreastCancerCsv,
  scaleFeatures,
  stratifiedSplit,
} from '../data.js';

const repoRoot =
  path.resolve(
    path.dirname(
      fileURLToPath(
        import.meta.url,
      ),
    ),
    '..',
    '..',
    '..',
  );

describe('Breast cancer assignment data', () => {
  const csv =
    fs.readFileSync(
      path.join(
        repoRoot,
        'shared',
        'datasets',
        'wdbc.csv',
      ),
      'utf8',
    );

  const parsed =
    parseBreastCancerCsv(
      csv,
    );

  it('contains the expected rows and features', () => {
    expect(
      parsed.rows,
    ).toHaveLength(569);

    expect(
      parsed.featureNames,
    ).toHaveLength(30);

    expect(
      parsed.rows.every(
        row =>
          row.features.length
            === 30
          && row.features.every(
            Number.isFinite,
          )
          && (
            row.target === 0
            || row.target === 1
          ),
      ),
    ).toBe(true);
  });

  it('creates a stratified train/test split', () => {
    const split =
      stratifiedSplit(
        parsed.rows,
        0.8,
      );

    expect(
      split.train.length
      + split.test.length,
    ).toBe(569);

    expect(
      split.train.some(
        row => row.target === 0,
      ),
    ).toBe(true);

    expect(
      split.train.some(
        row => row.target === 1,
      ),
    ).toBe(true);

    expect(
      split.test.some(
        row => row.target === 0,
      ),
    ).toBe(true);

    expect(
      split.test.some(
        row => row.target === 1,
      ),
    ).toBe(true);
  });

  it('scales training features into the 0..1 range', () => {
    const split =
      stratifiedSplit(
        parsed.rows,
        0.8,
      );

    const scaler =
      fitMinMax(
        split.train,
      );

    const scaled =
      split.train.map(
        row =>
          scaleFeatures(
            row.features,
            scaler,
          ),
      );

    expect(
      scaled
        .flat()
        .every(
          value =>
            value >= 0
            && value <= 1,
        ),
    ).toBe(true);
  });
});
