export const SPECIES = [
  'Iris-setosa',
  'Iris-versicolor',
  'Iris-virginica',
];

export function speciesToIndex(species) {
  const index = SPECIES.indexOf(species);

  if (index === -1) {
    throw new Error(
      'Unknown Iris species: ' + species,
    );
  }

  return index;
}

export function labelsToIndices(labels) {
  return labels.map(speciesToIndex);
}
