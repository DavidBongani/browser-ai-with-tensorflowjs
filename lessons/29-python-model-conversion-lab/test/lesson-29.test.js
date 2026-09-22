import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('Lesson 29 Python conversion lab', () => {
  test('records the Python lab output contract', () => {
    const evidence = JSON.parse(
      fs.readFileSync(
        path.join(lessonDir, 'lab-evidence.json'),
        'utf8',
      ),
    );

    expect(evidence.input).toEqual([3, 4]);
    expect(evidence.pythonOutput).toEqual([7, -1]);
    expect(evidence.operations).toEqual([
      'sum = x0 + x1',
      'difference = x0 - x1',
    ]);
  });

  test('commits a two-output converted LayersModel', () => {
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(lessonDir, 'web-model', 'model.json'),
        'utf8',
      ),
    );

    expect(manifest.format).toBe('layers-model');
    expect(manifest.convertedBy)
      .toBe('TensorFlow.js Converter v4.22.0');
    expect(
      manifest.modelTopology.model_config.config.name,
    ).toBe('lesson_29_lab');

    const weights = manifest.weightsManifest[0].weights;
    expect(weights).toEqual([
      {
        name: 'sum_difference/kernel',
        shape: [2, 2],
        dtype: 'float32',
      },
      {
        name: 'sum_difference/bias',
        shape: [2],
        dtype: 'float32',
      },
    ]);

    const shard = fs.readFileSync(
      path.join(
        lessonDir,
        'web-model',
        'group1-shard1of1.bin',
      ),
    );
    expect(shard.byteLength).toBe(24);
  });

  test('uses the real converter pipeline', () => {
    const source = fs.readFileSync(
      path.join(
        lessonDir,
        'python',
        'build_and_convert.py',
      ),
      'utf8',
    );

    expect(source).toContain('model.save(');
    expect(source)
      .toContain('h5_merged_saved_model_to_tfjs_format');
    expect(source).toContain('write_artifacts');
    expect(source).not.toContain('json.dump(');
  });
});
