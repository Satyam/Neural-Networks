class NN {
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
      // weights represent how to get from a previous layer to this one.
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

    const errors = Array.from({ length: this.#numLayers }, () =>
      Array.from([])
    );
    for (let step = this.#numLayers - 1; step > 0; step--) {
      const { size, layer, biases, weights } = this.#net[step];
      console.log({ step, size, layer, biases, weights });
      const nextLayer = this.#net[step - 1].layer;
      for (let row = 0; row < size; row++) {
        let err = 0;
        if (step == this.#numLayers - 1) {
          err = target[row] - layer[row];
        } else {
          const prevErrors = errors[step + 1];
          for (let col = 0; col < prevErrors.length; col++) {
            err += weights[col][row] * prevErrors[col];
          }
        }
        errors[step][row] = err;
        const weightFactor = learningRate * err * layer[row] * (1 - layer[row]);
        for (let col = 0; col < nextLayer.length; col++) {
          weights[row][col] += weightFactor * nextLayer[col];
        }
        biases[row] += learningRate * err;
      }
      debugger;
    }
  }
}
/*
train(inputs, target) {
  for (let i = 0; i < this.hiddenSize; i++) {
    this.hiddenLayer[i] = 0;
    for (let j = 0; j < this.inputSize; j++) {
      this.hiddenLayer[i] +=
      this.weightsInputToHidden[i][j] * inputs[j];
    }
    this.hiddenLayer[i] += this.biasHidden[i];
    this.hiddenLayer[i] = sigmoid(this.hiddenLayer[i]);
  }

  const output = new Array(this.outputSize);
  for (let i = 0; i < this.outputSize; i++) {
    output[i] = 0;
    for (let j = 0; j < this.hiddenSize; j++) {
      output[i] += this.weightsHiddenToOutput[i][j] * this.hiddenLayer[j];
    }
    output[i] += this.biasOutput[i];
    output[i] = sigmoid(output[i]);
  }

  const errorsOutput = new Array(this.outputSize);
  const errorsHidden = new Array(this.hiddenSize);

  for (let i = 0; i < this.outputSize; i++) {
    errorsOutput[i] = target[i] - output[i];
    for (let j = 0; j < this.hiddenSize; j++) {
      this.weightsHiddenToOutput[i][j] +=
        this.learningRate *
        errorsOutput[i] *
        output[i] *
        (1 - output[i]) *
        this.hiddenLayer[j];
      }
      this.biasOutput[i] += this.learningRate * errorsOutput[i];
    }

    for (let i = 0; i < this.hiddenSize; i++) {
      errorsHidden[i] = 0;
      for (let j = 0; j < this.outputSize; j++) {
        errorsHidden[i] += this.weightsHiddenToOutput[j][i] * errorsOutput[j];
      }
      this.biasHidden[i] += this.learningRate * errorsHidden[i];
      for (let j = 0; j < this.inputSize; j++) {
        this.weightsInputToHidden[i][j] +=
        this.learningRate *
        errorsHidden[i] *
        this.hiddenLayer[i] *
        (1 - this.hiddenLayer[i]) *
        inputs[j];
      }
    }
 }
*/
