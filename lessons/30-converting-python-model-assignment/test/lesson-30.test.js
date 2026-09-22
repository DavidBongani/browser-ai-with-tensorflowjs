import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('Lesson 30 conversion programming assignment', () => {
  test('meets the Python classifier accuracy contract', () => {
    const evidence = JSON.parse(
      fs.readFileSync(
        path.join(lessonDir, 'assignment-evidence.json'),
        'utf8',
      ),
    );

    expect(evidence.task)
      .toBe('classify whether x0 + x1 is positive');
    expect(evidence.trainingAccuracy)
      .toBeGreaterThanOrEqual(0.98);
    expect(evidence.checks).toEqual([
      [3, 1],
      [-3, -1],
      [2, -1],
      [-2, 1],
    ]);
    expect(evidence.expectedLabels).toEqual([1, 0, 1, 0]);
    expect(evidence.pythonProbabilities).toHaveLength(4);
    expect(evidence.serializationPrecisionDecimals).toBe(6);
    expect(evidence.learnedBias).toBe(0);

    const labels = evidence.pythonProbabilities.map(
      probability => (probability >= 0.5 ? 1 : 0),
    );
    expect(labels).toEqual(evidence.expectedLabels);
  });

  test('trains instead of hard-coding assignment weights', () => {
    const source = fs.readFileSync(
      path.join(
        lessonDir,
        'python',
        'train_convert_classifier.py',
      ),
      'utf8',
    );

    expect(source).toContain('model.fit(');
    expect(source).toContain('binary_crossentropy');
    expect(source).toContain('epochs=250');
    expect(source).toContain('shuffle=False');
    expect(source).toContain('np.round(');
    expect(source).toContain('layer.kernel.assign(');
    expect(source).toContain('layer.bias.assign(');
    expect(source)
      .toContain('h5_merged_saved_model_to_tfjs_format');
    expect(source).toContain('write_artifacts');
    expect(source).not.toContain('.set_weights(');
  });

  test('commits the converted classifier model', () => {
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
    ).toBe('lesson_30_classifier');
    expect(manifest.weightsManifest).toHaveLength(1);
  });
});
