import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('Lesson 27 trained linear conversion', () => {
  test('records a converged Python model', () => {
    const evidence = JSON.parse(
      fs.readFileSync(
        path.join(lessonDir, 'training-evidence.json'),
        'utf8',
      ),
    );

    expect(evidence.expectedRule).toBe('y = 3x + 1');
    expect(evidence.learnedWeight).toBeCloseTo(3, 4);
    expect(evidence.learnedBias).toBeCloseTo(1, 4);
    expect(evidence.pythonPredictionAt4).toBeCloseTo(13, 4);
    expect(evidence.finalLoss).toBeLessThan(1e-8);
  });

  test('uses real deterministic model training', () => {
    const source = fs.readFileSync(
      path.join(
        lessonDir,
        'python',
        'train_and_convert.py',
      ),
      'utf8',
    );

    expect(source).toContain('model.fit(');
    expect(source).toContain('epochs=120');
    expect(source).toContain('shuffle=False');
    expect(source).toContain(
      'h5_merged_saved_model_to_tfjs_format',
    );
    expect(source).toContain('write_artifacts');
  });

  test('commits a converted TensorFlow.js LayersModel', () => {
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(lessonDir, 'web-model', 'model.json'),
        'utf8',
      ),
    );

    expect(manifest.format).toBe('layers-model');
    expect(manifest.generatedBy).toBe('keras v2.21.0');
    expect(manifest.convertedBy)
      .toBe('TensorFlow.js Converter v4.22.0');
    expect(
      manifest.modelTopology.model_config.config.name,
    ).toBe('lesson_27_linear');
    expect(manifest.weightsManifest).toHaveLength(1);
  });
});
