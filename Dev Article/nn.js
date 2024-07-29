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
    this.#net
      .slice(1)
      .reverse()
      .forEach(({ size, layer, biases, weights }, backStep, net) => {
        // since it is reversed, the previous comes next.
        const prevLayer = net[backStep + 1]?.layer ?? inputs;
        const prevErrors = errors[backStep - 1];

        for (let row = 0; row < size; row++) {
          console.log({
            backStep,
            row,
            numRows: size,
            numCols: prevLayer.length,
            wrows: weights.length,
            wcols: weights[0].length,
          });
          let err = 0;
          if (backStep) {
            for (let col = 0; col < prevErrors.length; col++) {
              err += weights[col][row] * prevErrors[col];
            }
          } else {
            err = target[row] - layer[row];
          }
          errors[backStep][row] = err;
          // errors[row] = backStep
          //   ? Array(size).reduce(
          //       // **Important:
          //       //   the column and row arguments in the callback
          //       //   are reversed to produce an matrix flipped diagonally.
          //       (propagatedErr, err, col) =>
          //         propagatedErr + weights[col][row] * err,
          //       0
          //     )
          //   : target[row] - layer[row];
          const weightFactor =
            learningRate * err * layer[row] * (1 - layer[row]);
          for (let col = 0; col < weights[0].length; col++) {
            weights[row][col] += weightFactor * prevLayer[col];
          }
          biases[row] += learningRate * err;
        }
      });
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
 */
