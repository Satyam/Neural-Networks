class NeuralNetwork {
  constructor(...sizes) {
    this.sizes =
      sizes.length === 1 && Array.isArray(sizes[0]) ? sizes[0] : sizes;
    this.steps = this.sizes.length - 1;
    this.allWeights = Array.from({ length: this.steps }, (_, i) =>
      new Matrix(sizes[i + 1], sizes[i]).randomize(-1, 1)
    );
    this.allBiases = Array.from({ length: this.steps }, (_, i) =>
      new Vector(sizes[i + 1]).randomize(-1, 1)
    );
  }
  // TODO: feedForward should operate from one layer to the next
  // the first time called with input getting layer[1],
  // then layer[1] to layer[2] and so until output.

  feedForward(inputs) {
    let layer = new Vector(inputs);
    for (let step = 0; step < this.steps - 1; step++) {
      const weights = this.allWeights[step];
      const biases = this.allBiases[step];
      layer = weights.times(layer).add(biases).forEach(sigmoid);
    }
    return layer.vector;
  }

  train(inputs, target, learningRate) {
    const output = this.feedForward(inputs);

    const errorsOutput = output.map((o, i) => {
      let errOut = target[i] - o;
      const weightFactor = learningRate * errOut * o * (1 - o);
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weightsHiddenToOutput[i][j] += weightFactor * this.hiddenLayer[j];
      }
      this.biasOutput[i] += learningRate * errOut;
      return errOut;
    });

    for (let i = 0; i < this.hiddenSize; i++) {
      let errHidden = 0;
      for (let j = 0; j < this.outputSize; j++) {
        errHidden += this.weightsHiddenToOutput[j][i] * errorsOutput[j];
      }
      this.biasHidden[i] += learningRate * errHidden;
      const factor =
        learningRate *
        errHidden *
        this.hiddenLayer[i] *
        (1 - this.hiddenLayer[i]);
      for (let j = 0; j < this.inputSize; j++) {
        this.weightsInputToHidden[i][j] += factor * inputs[j];
      }
    }
  }
}
