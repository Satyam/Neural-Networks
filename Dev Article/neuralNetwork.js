class NeuralNetwork {
  #sizes;
  #weights;
  #biases;
  #layers;
  constructor(...sizes) {
    this.#sizes =
      sizes.length === 1 && Array.isArray(sizes[0]) ? sizes[0] : sizes;
    this.#weights = Array.from({ length: this.#sizes.length - 1 }, (_, i) =>
      new Matrix(sizes[i + 1], sizes[i]).randomize(-1, 1)
    );
    this.#biases = Array.from({ length: this.#sizes.length }, (_, i) =>
      i ? new Vector(sizes[i]).randomize(-1, 1) : null
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
        .add(this.#biases[step + 1])
        .forEach((val, i) => sigmoid(val));
    }
    return this.#layers.at(-1);
  }

  train(inputs, target, learningRate) {
    this.feedForward(inputs);

    let errors = null;
    for (let step = this.#sizes.length - 1; step; step--) {
      const prev = step - 1;
      const thisLayer = this.#layers[step];
      const prevLayer = this.#layers[prev];
      const thisWeights = this.#weights[step];
      const prevWeights = this.#weights[prev];

      errors = !errors
        ? new Vector(target).minus(thisLayer)
        : new Vector(
            // **Important:
            //   the column and row arguments in the callback
            //   are reversed to produce an matrix flipped diagonally.
            thisWeights.reduce((err, weight, col, row) => {
              err[row] += weight * errors.get(col);
              return err;
            }, Array(this.#sizes[step]).fill(0))
          );

      const weightFactor = errors
        .times(learningRate)
        .times(thisLayer)
        .times(new Vector(thisLayer).forEach((val) => 1 - val));

      prevWeights.forEach(
        (weight, row, col) =>
          weight + weightFactor.get(row) * prevLayer.get(col)
      );

      this.#biases[step].forEach(
        (bias, i) => bias + learningRate * errors.get(i)
      );
    }
  }
}
