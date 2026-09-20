import * as tf from '@tensorflow/tfjs';
import fs from 'node:fs/promises';

const outputDir = new URL('./assets/', import.meta.url);
await fs.mkdir(outputDir, { recursive: true });

const model = tf.sequential({
  layers: [
    tf.layers.dense({ inputShape: [1], units: 1, useBias: true }),
  ],
});

model.layers[0].setWeights([
  tf.tensor2d([[2]], [1, 1]),
  tf.tensor1d([1]),
]);

await model.save(tf.io.withSaveHandler(async artifacts => {
  const weightsName = 'group1-shard1of1.bin';
  const modelJson = {
    format: 'layers-model',
    generatedBy: 'TensorFlow.js',
    convertedBy: null,
    modelTopology: artifacts.modelTopology,
    weightsManifest: [{
      paths: [weightsName],
      weights: artifacts.weightSpecs,
    }],
  };

  await fs.writeFile(
    new URL('./assets/model.json', import.meta.url),
    JSON.stringify(modelJson, null, 2),
  );
  await fs.writeFile(
    new URL('./assets/' + weightsName, import.meta.url),
    Buffer.from(artifacts.weightData),
  );

  return {
    modelArtifactsInfo: tf.io.getModelArtifactsInfoForJSON(artifacts),
  };
}));

model.dispose();
console.log('Pre-trained Lesson 18 model artifact generated.');
