import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('Lesson 18 pretrained model assets', () => {
  test('ships a TensorFlow.js model manifest and weights', () => {
    const modelPath = path.join(lessonDir, 'assets', 'model.json');
    const weightsPath = path.join(
      lessonDir,
      'assets',
      'group1-shard1of1.bin',
    );

    const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));

    expect(model.format).toBe('layers-model');
    expect(model.weightsManifest).toHaveLength(1);
    expect(model.weightsManifest[0].paths).toEqual([
      'group1-shard1of1.bin',
    ]);
    expect(fs.statSync(weightsPath).size).toBeGreaterThan(0);
  });

  test('browser runtime loads rather than trains the model', () => {
    const source = fs.readFileSync(
      path.join(lessonDir, 'app.js'),
      'utf8',
    );

    expect(source).toContain('tf.loadLayersModel');
    expect(source).not.toContain('.fit(');
    expect(source).not.toContain('model.fit');
  });
});
