# Lesson 21 — MobileNet

MobileNet is a family of convolutional neural networks designed to make image
classification practical on devices with limited compute and memory.

A central efficiency idea is the **depthwise separable convolution**.

A standard convolution mixes spatial filtering and channel mixing in one
operation. Its parameter count is:

`kernelWidth × kernelHeight × inputChannels × outputChannels`

A depthwise separable convolution splits the work into two stages:

1. a depthwise convolution applies one spatial filter per input channel;
2. a 1 × 1 pointwise convolution mixes those channels into new outputs.

For a square kernel, its parameter count is:

`kernelSize² × inputChannels + inputChannels × outputChannels`

The interactive example compares both parameter counts so you can see why the
MobileNet design can be much lighter than a conventional convolution.

## Default example

For a 3 × 3 kernel with 32 input channels and 64 output channels:

- standard convolution: 18,432 parameters;
- depthwise stage: 288 parameters;
- pointwise stage: 2,048 parameters;
- depthwise separable total: 2,336 parameters.

That is about an 87.3% reduction in convolution parameters for this layer.

## Scope

This lesson explains the architectural idea behind MobileNet. The next lesson,
Using MobileNet, will load and apply the pretrained model in the browser.

## Implementation checkpoint

The tested implementation for this lesson is preserved at:

https://github.com/DavidBongani/browser-ai-with-tensorflowjs/commit/7ff62d6dbb942d192dae7dc9352bc9f321682c89
