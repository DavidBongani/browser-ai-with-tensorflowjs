import {
  loadMnistSlice,
  oneHotArgMax,
} from './mnist-loader.js';

async function main() {
  await tf.ready();

  const data = await loadMnistSlice(
    tf,
    {
      start: 0,
      count: 100,
      chunkRows: 25,
    },
  );

  const firstLabel =
    Array.from(
      data.raw.labels.slice(0, 10),
    );

  const minValue =
    data.xs.min().dataSync()[0];

  const maxValue =
    data.xs.max().dataSync()[0];

  const labelSums =
    data.ys.sum(1).dataSync();

  const result = {
    xsShape: data.xs.shape,
    ysShape: data.ys.shape,
    minPixel: minValue,
    maxPixel: maxValue,
    firstLabel,
    firstClass: oneHotArgMax(firstLabel),
    everyLabelIsOneHot:
      Array.from(labelSums).every(
        value => value === 1,
      ),
  };

  document.querySelector('#output').textContent =
    JSON.stringify(result, null, 2);
  document.querySelector('#status').textContent =
    'Examples converted to tensors';

  window.__LESSON_13_RESULT__ = result;

  data.xs.dispose();
  data.ys.dispose();
}

main().catch(error => {
  console.error(error);
  window.__LESSON_13_ERROR__ =
    error instanceof Error ? error.message : String(error);
});
