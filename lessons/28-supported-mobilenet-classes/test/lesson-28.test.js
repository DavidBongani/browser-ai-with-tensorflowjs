import { describe, expect, test } from 'vitest';
import {
  IMAGENET_CLASSES,
  IMAGENET_CLASS_COUNT,
} from '../imagenet-classes.js';
import {
  classSummary,
  getClassById,
  searchClasses,
} from '../class-search.js';

describe('Lesson 28 MobileNet ImageNet classes', () => {
  test('contains exactly 1000 indexed classes', () => {
    expect(IMAGENET_CLASS_COUNT).toBe(1000);
    expect(Object.keys(IMAGENET_CLASSES)).toHaveLength(1000);
    expect(Object.keys(IMAGENET_CLASSES).map(Number))
      .toEqual(Array.from({ length: 1000 }, (_, index) => index));
  });

  test('preserves representative upstream labels', () => {
    expect(getClassById(0)).toEqual({
      classId: 0,
      className: 'tench, Tinca tinca',
    });
    expect(getClassById(504)).toEqual({
      classId: 504,
      className: 'coffee mug',
    });
    expect(getClassById(999)).toEqual({
      classId: 999,
      className: 'toilet tissue, toilet paper, bathroom tissue',
    });
  });

  test('searches aliases and names case-insensitively', () => {
    const retrievers = searchClasses('RETRIEVER', 20);
    expect(retrievers.map(item => item.classId))
      .toEqual(expect.arrayContaining([205, 206, 207, 208, 209]));

    const volcano = searchClasses('volcano');
    expect(volcano).toEqual([
      {
        classId: 980,
        className: 'volcano',
      },
    ]);
  });

  test('summarizes the class contract', () => {
    expect(classSummary()).toEqual({
      count: 1000,
      first: {
        classId: 0,
        className: 'tench, Tinca tinca',
      },
      middle: {
        classId: 504,
        className: 'coffee mug',
      },
      last: {
        classId: 999,
        className: 'toilet tissue, toilet paper, bathroom tissue',
      },
    });
  });
});
