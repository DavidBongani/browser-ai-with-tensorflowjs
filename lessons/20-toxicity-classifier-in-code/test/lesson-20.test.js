import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

describe('Lesson 20 toxicity classifier code', () => {
  test('loads the published toxicity model and classifies text', () => {
    const html = fs.readFileSync(
      path.join(lessonDir, 'index.html'),
      'utf8',
    );
    const app = fs.readFileSync(
      path.join(lessonDir, 'app.js'),
      'utf8',
    );

    expect(html).toContain('@tensorflow-models/toxicity@1.2.2');
    expect(app).toContain('toxicity.load(threshold)');
    expect(app).toContain('model.classify([text])');
    expect(app).not.toContain('.fit(');
  });
});
