import { describe, expect, test } from 'vitest';
import {
  SOURCE_FORMATS,
  buildConversionCommand,
  expectedArtifacts,
} from '../conversion-plan.js';

describe('Lesson 25 conversion plan', () => {
  test('builds a Keras HDF5 conversion command', () => {
    const command = buildConversionCommand({
      kind: 'keras',
      inputPath: './python/model.h5',
      outputDirectory: './web_model',
    });

    expect(command).toContain('--input_format=keras');
    expect(command).not.toContain('--output_format=tfjs_graph_model');
    expect(command).toContain('model.h5');
  });

  test('builds a SavedModel graph conversion command', () => {
    const command = buildConversionCommand({
      kind: 'savedModel',
      inputPath: './python/saved_model',
      outputDirectory: './web_model',
    });

    expect(command).toContain('--input_format=tf_saved_model');
    expect(command).toContain('--output_format=tfjs_graph_model');
  });

  test('describes generated browser artifacts', () => {
    expect(expectedArtifacts('./web_model')).toEqual({
      manifest: './web_model/model.json',
      weights: './web_model/group*-shard*of*.bin',
    });
  });

  test('documents the corresponding TensorFlow.js model types', () => {
    expect(SOURCE_FORMATS.keras.outputFormat)
      .toBe('tfjs_layers_model');
    expect(SOURCE_FORMATS.savedModel.outputFormat)
      .toBe('tfjs_graph_model');
  });
});
