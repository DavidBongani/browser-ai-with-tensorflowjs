import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('Lesson 26 real Python-to-TensorFlow.js conversion', () => {
  test('commits official converter artifacts with exact weights', () => {
    const modelPath = path.join(
      lessonDir,
      'web-model',
      'model.json',
    );
    const shardPath = path.join(
      lessonDir,
      'web-model',
      'group1-shard1of1.bin',
    );

    const model = JSON.parse(
      fs.readFileSync(modelPath, 'utf8'),
    );
    const shard = fs.readFileSync(shardPath);

    expect(model.format).toBe('layers-model');
    expect(model.generatedBy).toBe('keras v2.21.0');
    expect(model.convertedBy)
      .toBe('TensorFlow.js Converter v4.22.0');

    expect(model.modelTopology.model_config.class_name)
      .toBe('Sequential');
    expect(model.modelTopology.model_config.config.name)
      .toBe('lesson_26_linear');

    expect(model.weightsManifest).toHaveLength(1);
    expect(model.weightsManifest[0].paths)
      .toEqual(['group1-shard1of1.bin']);
    expect(model.weightsManifest[0].weights)
      .toEqual([
        {
          name: 'score/kernel',
          shape: [2, 1],
          dtype: 'float32',
        },
        {
          name: 'score/bias',
          shape: [1],
          dtype: 'float32',
        },
      ]);

    expect(shard.byteLength).toBe(12);

    const view = new DataView(
      shard.buffer,
      shard.byteOffset,
      shard.byteLength,
    );
    const values = [0, 4, 8].map(offset =>
      view.getFloat32(offset, true),
    );

    expect(values).toEqual([2, -1, 0.5]);
  });

  test('source script performs a real HDF5 conversion', () => {
    const source = fs.readFileSync(
      path.join(
        lessonDir,
        'python',
        'create_and_convert.py',
      ),
      'utf8',
    );

    expect(source).toContain('model.save(');
    expect(source)
      .toContain('h5_merged_saved_model_to_tfjs_format');
    expect(source).toContain('write_artifacts');
    expect(source).toContain('tensorflowjs');
    expect(source).not.toContain('json.dump(');
  });

  test('browser code loads the converted LayersModel', () => {
    const source = fs.readFileSync(
      path.join(lessonDir, 'app.js'),
      'utf8',
    );

    expect(source)
      .toContain("tf.loadLayersModel(");
    expect(source)
      .toContain("'./web-model/model.json'");
    expect(source).not.toContain('.fit(');
  });
});
