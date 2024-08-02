class NeuralNetwork {
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
        ? Array.from({ length: size }, () => Math.random() * 2 - 1)
        : undefined,
      layer: new Array(size),
      // weights represent how to reach this layer from the previous.
      weights: i
        ? Array.from({ length: size }, () =>
            Array.from(
              { length: this.#sizes[i - 1] },
              () => Math.random() * 2 - 1
            )
          )
        : undefined,
    }));
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
