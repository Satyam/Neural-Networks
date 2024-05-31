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
    for (let i = 0; i < this.hiddenSize; i++) {
      this.hiddenLayer[i] = 0;
      for (let j = 0; j < this.inputSize; j++) {
        this.hiddenLayer[i] += this.weightsInputToHidden[i][j] * inputs[j];
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
    return output;
  }

  train(inputs, target) {
    const output = this.feedForward(inputs);

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
}
