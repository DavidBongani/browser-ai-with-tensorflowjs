export const SOURCE_FORMATS = {
  keras: {
    label: 'Keras HDF5 model',
    inputFormat: 'keras',
    extension: '.h5',
    outputFormat: 'tfjs_layers_model',
  },
  savedModel: {
    label: 'TensorFlow SavedModel',
    inputFormat: 'tf_saved_model',
    extension: null,
    outputFormat: 'tfjs_graph_model',
  },
};

export function buildConversionCommand({
  kind,
  inputPath,
  outputDirectory,
}) {
  const source = SOURCE_FORMATS[kind];

  if (!source) {
    throw new Error('Unsupported source model format.');
  }

  if (!inputPath || !outputDirectory) {
    throw new Error('Input and output paths are required.');
  }

  const flags = [
    'tensorflowjs_converter',
    `--input_format=${source.inputFormat}`,
  ];

  if (source.outputFormat === 'tfjs_graph_model') {
    flags.push('--output_format=tfjs_graph_model');
  }

  flags.push(
    JSON.stringify(inputPath),
    JSON.stringify(outputDirectory),
  );

  return flags.join(' ');
}

export function expectedArtifacts(outputDirectory) {
  return {
    manifest: `${outputDirectory}/model.json`,
    weights: `${outputDirectory}/group*-shard*of*.bin`,
  };
}
