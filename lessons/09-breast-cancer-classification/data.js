export const DIAGNOSIS_TO_TARGET = {
  B: 0,
  M: 1,
};

export function parseBreastCancerCsv(text) {
  const lines = text
    .trim()
    .split(/\r?\n/);

  const header =
    lines[0].split(',');

  const featureNames =
    header.slice(2);

  const rows =
    lines
      .slice(1)
      .filter(Boolean)
      .map(line => {
        const values =
          line.split(',');

        const diagnosis =
          values[1];

        const target =
          DIAGNOSIS_TO_TARGET[
            diagnosis
          ];

        if (
          target !== 0
          && target !== 1
        ) {
          throw new Error(
            'Unknown diagnosis: '
            + diagnosis,
          );
        }

        const features =
          values
            .slice(2)
            .map(Number);

        if (
          features.length
            !== featureNames.length
          || features.some(
            value =>
              !Number.isFinite(
                value,
              ),
          )
        ) {
          throw new Error(
            'Invalid feature row.',
          );
        }

        return {
          id: values[0],
          diagnosis,
          target,
          features,
        };
      });

  return {
    featureNames,
    rows,
  };
}

export function stratifiedSplit(
  rows,
  trainFraction = 0.8,
) {
  const benign =
    rows.filter(
      row =>
        row.target === 0,
    );

  const malignant =
    rows.filter(
      row =>
        row.target === 1,
    );

  function splitClass(group) {
    const trainCount =
      Math.floor(
        group.length
        * trainFraction,
      );

    return {
      train:
        group.slice(
          0,
          trainCount,
        ),
      test:
        group.slice(
          trainCount,
        ),
    };
  }

  const benignSplit =
    splitClass(benign);

  const malignantSplit =
    splitClass(malignant);

  return {
    train: [
      ...benignSplit.train,
      ...malignantSplit.train,
    ],
    test: [
      ...benignSplit.test,
      ...malignantSplit.test,
    ],
  };
}

export function fitMinMax(rows) {
  const featureCount =
    rows[0].features.length;

  const min =
    new Array(
      featureCount,
    ).fill(Infinity);

  const max =
    new Array(
      featureCount,
    ).fill(-Infinity);

  for (const row of rows) {
    row.features.forEach(
      (value, index) => {
        min[index] =
          Math.min(
            min[index],
            value,
          );

        max[index] =
          Math.max(
            max[index],
            value,
          );
      },
    );
  }

  return {
    min,
    max,
  };
}

export function scaleFeatures(
  features,
  scaler,
) {
  return features.map(
    (value, index) => {
      const range =
        scaler.max[index]
        - scaler.min[index];

      if (range === 0) {
        return 0;
      }

      return (
        value
        - scaler.min[index]
      ) / range;
    },
  );
}
