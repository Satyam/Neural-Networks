class NeuralNetwork {
  #sizes;
  #weights;
  #biases;
  #layers;
  constructor(...sizes) {
    this.#sizes =
      sizes.length === 1 && Array.isArray(sizes[0]) ? sizes[0] : sizes;
    const steps = this.#sizes.length - 1;
    this.#weights = Array.from({ length: steps }, (_, i) =>
      new Matrix(sizes[i + 1], sizes[i]).randomize(-1, 1)
    );
    this.#biases = Array.from({ length: steps }, (_, i) =>
      new Vector(sizes[i + 1]).randomize(-1, 1)
    );
    this.#layers = Array.from(
      { length: this.#sizes.length },
      (_, i) => new Vector(sizes[i])
    );
  }

  feedForward(inputs) {
    this.#layers[0] = new Vector(inputs);
    for (let step = 0; step < this.#sizes.length - 1; step++) {
      this.#layers[step + 1] = this.#weights[step]
        .times(this.#layers[step])
        .add(this.#biases[step])
        .forEach((val, i) => sigmoid(val));
    }
    return this.#layers.at(-1);
  }

  train(inputs, target, learningRate) {
    const output = this.feedForward(inputs).toArray();

    const errorsOutput = output.map((o, i) => {
      let errOut = target[i] - o;
      const weightFactor = learningRate * errOut * o * (1 - o);
      for (let j = 0; j < this.#sizes[1]; j++) {
        this.#weights[1].set(
          i,
          j,
          this.#weights[1].get(i, j) + weightFactor * this.#layers[1][j]
        );
        //   this.weightsHiddenToOutput[i][j] += weightFactor * this.hiddenLayer[j];
      }
      this.#biases[1] = this.#biases[1].times(learningRate * errOut);
      // this.biasOutput[i] += learningRate * errOut;
      return errOut;
    });

    for (let i = 0; i < this.#sizes[1]; i++) {
      let errHidden = 0;
      for (let j = 0; j < this.#sizes[2]; j++) {
        errHidden += this.#weights[1].get(j, i) * errorsOutput[j];
        // errHidden += this.weightsHiddenToOutput[j][i] * errorsOutput[j];
      }
      this.#biases[1][i] += learningRate * errHidden;
      const factor =
        learningRate *
        errHidden *
        this.#layers[1][i] *
        (1 - this.#layers[1][i]);
      for (let j = 0; j < this.#sizes[0]; j++) {
        this.#weights[0].set(
          i,
          j,
          this.#weights[0].get(i, j) + factor * inputs[j]
        );
        // this.weightsInputToHidden[i][j] += factor * inputs[j];
      }
    }
  }
}
