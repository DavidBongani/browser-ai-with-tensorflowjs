import {
  buildConversionCommand,
  expectedArtifacts,
} from './conversion-plan.js';

const format = document.querySelector('#format');

function render() {
  const kind = format.value;
  const inputPath =
    kind === 'keras' ? './python/model.h5' : './python/saved_model';
  const outputDirectory = './web_model';

  const command = buildConversionCommand({
    kind,
    inputPath,
    outputDirectory,
  });

  const artifacts = expectedArtifacts(outputDirectory);

  document.querySelector('#command').textContent = command;
  document.querySelector('#artifacts').textContent =
    JSON.stringify(artifacts, null, 2);

  window.__LESSON_25_RESULT__ = {
    kind,
    command,
    artifacts,
  };
}

format.addEventListener('change', render);
render();
