import {
  IMAGENET_CLASSES,
  IMAGENET_CLASS_COUNT,
} from './imagenet-classes.js';

export function getClassById(classId) {
  if (!Number.isInteger(classId)) return null;

  const className = IMAGENET_CLASSES[classId];
  if (typeof className !== 'string') return null;

  return {
    classId,
    className,
  };
}

export function searchClasses(query, limit = 20) {
  const normalized = String(query).trim().toLowerCase();

  if (!normalized) return [];

  return Object.entries(IMAGENET_CLASSES)
    .filter(([, className]) =>
      className.toLowerCase().includes(normalized),
    )
    .slice(0, limit)
    .map(([classId, className]) => ({
      classId: Number(classId),
      className,
    }));
}

export function classSummary() {
  return {
    count: IMAGENET_CLASS_COUNT,
    first: getClassById(0),
    middle: getClassById(504),
    last: getClassById(999),
  };
}
