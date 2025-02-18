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
        ? Float64Array.from({ length: size }, randomCoeficient)
        : undefined,
      layer: new Float64Array(size),
      // weights represent how to reach this layer from the previous.
      weights: i
        ? Array.from({ length: size }, () =>
            Float64Array.from({ length: this.#sizes[i - 1] }, randomCoeficient)
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
      net: this.#net.map((level) => ({
        size: level.size,
        biases: Array.from(level.biases ?? []),
        weights: level.weights?.map((w) => Array.from(w)) ?? [],
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
    if (newNet.sizes.some((size, l) => size !== this.#sizes[l])) {
      throw new Error(
        `Size of layers of new data: [${newNet.sizes.join(',')}] 
        does not match current network: [${this.#sizes.join(',')}]`
      );
    }
    newNet.net.forEach((layer, l) => {
      if (layer.size !== this.#sizes[l]) {
        throw new Error(
          `Size of layer ${l} does not match current network: ${this.#sizes[l]}`
        );
      }
      if (l) {
        if (!Array.isArray(layer.biases)) {
          throw new Error(`Biases should be an array`);
        }
        if (!Array.isArray(layer.weights)) {
          throw new Error(`Weights should be an array of arrays`);
        }
        if (layer.biases.length !== layer.size) {
          throw new Error(
            `Not enough biases: ${layer.biases.length} for that size: ${layer.size}`
          );
        }
        layer.biases.forEach((b, row) => {
          if (!Number.isFinite(b)) {
            throw new Error(
              `Value of bias ${row} on layer ${l} should be a number: >${b}`
            );
          }
          this.#net[l].biases[row] = b;
        });
        if (layer.weights.length !== layer.size) {
          throw new Error(
            `Not enough weights: ${layer.weights.length} for that size: ${layer.size}`
          );
        }
        layer.weights.forEach((ws, row) => {
          if (!Array.isArray(ws)) {
            throw new Error(`Weights should be an array of arrays`);
          }
          if (ws.length !== this.#sizes[l - 1]) {
            throw new Error(
              `Not enough weights : ${layer.biases.length} for that size: ${layer.size}`
            );
          }
          ws.forEach((w, i) => {
            if (!Number.isFinite(w)) {
              throw new Error(
                `Value of weight ${i} on row ${row} on layer ${l} should be a number: >${w}`
              );
            }
            this.#net[l].weights[row][i] = w;
          });
        });
      } else {
        if (
          (layer.biases &&
            Array.isArray(layer.biases) &&
            layer.biases.length) ||
          (layer.weights &&
            Array.isArray(layer.weights) &&
            layer.weights.length)
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
            (out, prevValue, col) => out + weights[row][col] * prevValue,
            0
          ) + biases[row]
        );
      }
    }
    return net.at(-1).layer;
  }

  train(inputs, target, learningRate) {
    this.feedForward(inputs);

    let prevErrors = [];
    let prevWeights;
    for (let step = this.#numLayers - 1; step > 0; step--) {
      let errors = [];
      const { size, layer, biases, weights } = this.#net[step];
      const nextLayer = this.#net[step - 1].layer;
      for (let row = 0; row < size; row++) {
        let err = 0;
        if (step == this.#numLayers - 1) {
          err = target[row] - layer[row];
        } else {
          for (let col = 0; col < prevErrors.length; col++) {
            err += prevWeights[col][row] * prevErrors[col];
          }
        }
        errors[row] = err;
        const weightFactor = learningRate * err * layer[row] * (1 - layer[row]);
        for (let col = 0; col < nextLayer.length; col++) {
          weights[row][col] += weightFactor * nextLayer[col];
        }
        biases[row] += learningRate * err;
      }
      prevErrors = errors;
      prevWeights = weights;
    }
  }
}
