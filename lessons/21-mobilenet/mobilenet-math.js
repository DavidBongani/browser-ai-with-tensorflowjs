export function standardConvParameters(
  kernelSize,
  inputChannels,
  outputChannels,
) {
  return (
    kernelSize *
    kernelSize *
    inputChannels *
    outputChannels
  );
}

export function depthwiseSeparableParameters(
  kernelSize,
  inputChannels,
  outputChannels,
) {
  const depthwise =
    kernelSize *
    kernelSize *
    inputChannels;

  const pointwise =
    inputChannels *
    outputChannels;

  return {
    depthwise,
    pointwise,
    total: depthwise + pointwise,
  };
}

export function compareConvolutions(
  kernelSize,
  inputChannels,
  outputChannels,
) {
  const standard = standardConvParameters(
    kernelSize,
    inputChannels,
    outputChannels,
  );

  const separable = depthwiseSeparableParameters(
    kernelSize,
    inputChannels,
    outputChannels,
  );

  return {
    standard,
    depthwise: separable.depthwise,
    pointwise: separable.pointwise,
    separable: separable.total,
    reduction:
      1 - separable.total / standard,
  };
}
