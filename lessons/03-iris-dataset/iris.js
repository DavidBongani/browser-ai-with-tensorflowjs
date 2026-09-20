export const IRIS_FEATURE_NAMES = [
  'sepal_length',
  'sepal_width',
  'petal_length',
  'petal_width',
];

export function parseIrisCsv(text) {
  const lines = text
    .trim()
    .split(/\r?\n/);

  const header = lines[0].split(',');

  const rows = lines
    .slice(1)
    .filter(Boolean)
    .map(line => {
      const values = line.split(',');

      return {
        features: values
          .slice(0, 4)
          .map(Number),
        species: values[4],
      };
    });

  return {
    header,
    rows,
  };
}

export function summarizeIris(rows) {
  const classCounts = {};

  for (const row of rows) {
    classCounts[row.species] =
      (classCounts[row.species] ?? 0) + 1;
  }

  return {
    rowCount: rows.length,
    featureCount:
      rows[0]?.features.length ?? 0,
    classCounts,
  };
}
