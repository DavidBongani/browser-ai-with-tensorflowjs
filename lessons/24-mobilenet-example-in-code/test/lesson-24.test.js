import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const lessonDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('Lesson 24 complete MobileNet example', () => {
  test('loads, classifies, and renders predictions', () => {
    const html = fs.readFileSync(path.join(lessonDir, 'index.html'), 'utf8');
    const app = fs.readFileSync(path.join(lessonDir, 'app.js'), 'utf8');

    expect(html).toContain('@tensorflow-models/mobilenet@2.1.1');
    expect(app).toContain('mobilenet.load');
    expect(app).toContain('model.classify(image, 3)');
    expect(app).toContain("querySelector('#output').innerHTML");
    expect(app).not.toContain('.fit(');
  });
});
