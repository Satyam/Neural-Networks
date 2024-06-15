class NeuralNetwork {
  constructor(...sizes) {
    this.sizes =
      sizes.length === 1 && Array.isArray(sizes[0]) ? sizes[0] : sizes;
    const steps = this.sizes.length - 1;
    this.allWeights = Array.from({ length: steps }, (_, i) =>
      new Matrix(sizes[i + 1], sizes[i]).randomize(-1, 1)
    );
    this.allBiases = Array.from({ length: steps }, (_, i) =>
      new Vector(sizes[i + 1]).randomize(-1, 1)
    );
    this.layers = Array.from(
      { length: this.sizes.length },
      (_, i) => new Vector(sizes[i])
    );
  }

  feedForward(inputs) {
    this.layers[0] = new Vector(inputs);
    for (let step = 0; step < this.sizes - 1; step++) {
      let layer = this.layers[step];
      const weights = this.allWeights[step];
      const biases = this.allBiases[step];
      this.layers[step + 1] = weights.times(layer).add(biases).forEach(sigmoid);
    }
    return this.layers.at(-1);
  }

  train(inputs, target, learningRate) {
    const output = this.feedForward(inputs).toArray();

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
