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
    const output = this.feedForward(inputs);
    const errors = [];
    errors[2] = new Vector(target).minus(output);
    const wF = errors[2]
      .times(learningRate)
      .times(output)
      .times(new Vector(output.numItems).fill(1).minus(output));
    this.#weights[1].forEach(
      (val, row, col) => val + wF.get(row) * this.#layers[1].get(col)
    );
    this.#biases[2].forEach((b, i) => b + learningRate * errors[2].get(i));

    // for the inverse matrix, I swap the column and row indices
    errors[1] = new Vector(
      this.#weights[1].reduce((e, w, c, r) => {
        e[r] += w * errors[2].get(c);
        return e;
      }, Array(this.#weights[1].cols).fill(0))
    );
    this.#biases[1].forEach((b, i) => b + learningRate * errors[1].get(i));
    const wf1 = errors[1]
      .times(learningRate)
      .times(this.#layers[1])
      .times(new Vector(this.#sizes[1]).fill(1).minus(this.#layers[1]));
    this.#weights[0].forEach(
      (weight, row, col) => weight + wf1.get(row) * inputs[col]
    );
  }
}
