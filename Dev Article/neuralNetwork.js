import { sigmoid, randomCoeficient } from './utils.js';

export class NeuralNetwork {
  #sizes;
  #net;
  #numLayers;
  constructor(...sizes) {
    this.#sizes =
      sizes.length === 1 && Array.isArray(sizes[0]) ? sizes[0] : sizes;
    this.#numLayers = this.#sizes.length;
    this.#net = this.#sizes.map((size, i) => ({
      size,
      biases: i
        ? // ? Float64Array.from({ length: size }, randomCoeficient)
          new Float64Array(size).fill(0)
        : undefined,
      layer: new Float64Array(size),
      // weights represent how to reach this layer from the previous.
      weights: i
        ? Array.from({ length: size }, () =>
            //     Float64Array.from({ length: this.#sizes[i - 1] }, randomCoeficient)
            new Float64Array(this.#sizes[i - 1]).fill(0.5)
          )
        : undefined,
    }));
  }

  get numLayers() {
    return this.#numLayers;
  }
  getSizes() {
    return this.#sizes;
  }
  getSize(numLayer) {
    return this.#net[numLayer].size;
  }
  getLayer(numLayer) {
    return this.#net[numLayer].layer;
  }
  getWeights(numLayer) {
    return this.#net[numLayer].weights;
  }
  getBiases(numLayer) {
    return this.#net[numLayer].biases;
  }

  toJSON() {
    return {
      numLayers: this.#numLayers,
      sizes: this.#sizes.slice(),
      net: this.#net.map(({ size, biases, weights }) => ({
        size,
        biases: Array.from(biases ?? []),
        weights: weights?.map((w) => Array.from(w)) ?? [],
      })),
    };
  }

  loadNet(newNet) {
    if (newNet.numLayers !== this.#numLayers) {
      throw new Error(
        `Number of layers in new data: ${
          newNet.numLayers
        } does not match current network: ${this.#numLayers}`
      );
    }
    if (newNet.sizes.some((size, step) => size !== this.#sizes[step])) {
      throw new Error(
        `Size of layers of new data: [${newNet.sizes.join(',')}] 
        does not match current network: [${this.#sizes.join(',')}]`
      );
    }
    newNet.net.forEach(({ size, biases, weights }, step) => {
      if (size !== this.#sizes[step]) {
        throw new Error(
          `Size of layer ${step} does not match current network: ${
            this.#sizes[step]
          }`
        );
      }
      if (step) {
        if (!Array.isArray(biases)) {
          throw new Error(`Biases should be an array`);
        }
        if (!Array.isArray(weights)) {
          throw new Error(`Weights should be an array of arrays`);
        }
        if (biases.length !== size) {
          throw new Error(
            `Not enough biases: ${biases.length} for that size: ${size}`
          );
        }
        biases.forEach((b, row) => {
          if (!Number.isFinite(b)) {
            throw new Error(
              `Value of bias ${row} on layer ${step} should be a number: >${b}`
            );
          }
          this.#net[step].biases[row] = b;
        });
        if (weights.length !== size) {
          throw new Error(
            `Not enough weights: ${weights.length} for that size: ${size}`
          );
        }
        weights.forEach((ws, row) => {
          if (!Array.isArray(ws)) {
            throw new Error(`Weights should be an array of arrays`);
          }
          if (ws.length !== this.#sizes[step - 1]) {
            throw new Error(
              `Not enough weights : ${biases.length} for that size: ${size}`
            );
          }
          ws.forEach((w, i) => {
            if (!Number.isFinite(w)) {
              throw new Error(
                `Value of weight ${i} on row ${row} on layer ${step} should be a number: >${w}`
              );
            }
            this.#net[step].weights[row][i] = w;
          });
        });
      } else {
        if (
          (biases && Array.isArray(biases) && biases.length) ||
          (weights && Array.isArray(weights) && weights.length)
        ) {
          throw new Error(
            `In the first layer, biases and weights should not be present or be empty arrays`
          );
        }
      }
    });
  }

  feedForward(inputs) {
    const net = this.#net;
    net[0].layer = inputs;
    for (let step = 1; step < net.length; step++) {
      const prevLayer = net[step - 1].layer;
      const { layer, biases, weights, size } = net[step];
      for (let row = 0; row < size; row++) {
        layer[row] = sigmoid(
          prevLayer.reduce(
            (out, prevValue, prevRow) =>
              out + weights[row][prevRow] * prevValue,
            0
          ) + biases[row]
        );
      }
    }
    return net.at(-1).layer;
  }

  train(inputs, target, learningRate) {
    this.feedForward(inputs);

    console.log(
      'd.For input',
      inputs,
      'output',
      this.getLayer(this.numLayers - 1),
      'expected',
      target
    );
    /*
    Here we are back traking so the prev and next prefixes are backwards.
    Previous items are towards the end of the network, 
    next items are towards the begining.
    */
    let prevErrors = [];
    let prevWeights;
    for (let step = this.#numLayers - 1; step > 0; step--) {
      const errors = [];
      const { size, layer, biases, weights } = this.#net[step];
      const nextLayer = this.#net[step - 1].layer;
      for (let row = 0; row < size; row++) {
        let err = 0;
        if (step == this.#numLayers - 1) {
          err = target[row] - layer[row];
        } else {
          for (let prevRow = 0; prevRow < prevErrors.length; prevRow++) {
            console.log(
              'from [',
              step,
              ',',
              row,
              '] to [',
              step + 1,
              ',',
              prevRow,
              ']'
            );

            err += prevWeights[prevRow][row] * prevErrors[prevRow];
            console.log(
              'prevErrors[prevRow]',
              prevErrors[prevRow],
              'conn weight',
              prevWeights[prevRow][row],
              'error',
              err
            );
          }
        }
        errors[row] = err;
        const correctionFactor =
          learningRate * err * layer[row] * (1 - layer[row]);
        console.log(
          'd.layer',
          step,
          'error',
          err,
          'delta',
          err * layer[row] * (1 - layer[row]),
          'change',
          correctionFactor
        );
        for (let nextRow = 0; nextRow < nextLayer.length; nextRow++) {
          weights[row][nextRow] += correctionFactor * nextLayer[nextRow];
        }
        biases[row] += learningRate * err;
      }
      prevErrors = errors;
      prevWeights = weights;
    }
  }
}
