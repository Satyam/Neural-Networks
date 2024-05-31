class NeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.weightsInputToHidden = Array.from({ length: hiddenSize }, () =>
      Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
    );
    this.biasHidden = Array(hiddenSize).fill(0);
    this.weightsHiddenToOutput = Array.from({ length: outputSize }, () =>
      Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1)
    );
    this.biasOutput = Array(outputSize).fill(0);
    this.learningRate = document.querySelector('#learningRate').value; // Adjusted learning rate
    this.hiddenLayer = new Array(this.hiddenSize);
  }

  feedForward(inputs) {
    this.hiddenLayer = Array.from(
      { length: this.hiddenSize },
      (node = 0, i) => {
        for (let j = 0; j < this.inputSize; j++) {
          node += this.weightsInputToHidden[i][j] * inputs[j];
        }
        return sigmoid(node + this.biasHidden[i]);
      }
    );

    return Array.from({ length: this.outputSize }, (node = 0, i) => {
      for (let j = 0; j < this.hiddenSize; j++) {
        node += this.weightsHiddenToOutput[i][j] * this.hiddenLayer[j];
      }
      return sigmoid(node + this.biasOutput[i]);
    });
  }

  train(inputs, target) {
    const output = this.feedForward(inputs);

    // const errorsOutput = new Array(this.outputSize);
    const errorsHidden = new Array(this.hiddenSize);

    const errorsOutput = output.map((o, i) => {
      let e = target[i] - o;
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weightsHiddenToOutput[i][j] +=
          this.learningRate * e * o * (1 - o) * this.hiddenLayer[j];
      }
      this.biasOutput[i] += this.learningRate * e;
      return e;
    });

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
}
