import sigmoid from './sigmoid.mjs';
import Connection from './connection.mjs';
import Layer from './layer.mjs';

class Network {
  constructor(numberOfLayers) {
    // Create a network with a number of layers. For layers different than the input layer we add a random Bias to each neuron
    this.layers = numberOfLayers.map((length, index) => {
      const layer = new Layer(length);
      // if (index !== 0) {
      layer.neurons.forEach((neuron, row) => {
        neuron.setBias(0); //neuron.getRandomBias());
        neuron.layer = index;
        neuron.row = row;
      });
      // }
      return layer;
    });

    this.learningRate = 0.3; // multiply's against the input and the delta then adds to momentum
    this.momentum = 0.1; // multiply's against the specified "change" then adds to learning rate for change

    this.iterations = 0; // number of iterations in the training process
    this.connectLayers();
  }

  toJSON() {
    return {
      learningRate: this.learningRate,
      iterations: this.iterations,
      layers: this.layers.map((l) => l.toJSON()),
    };
  }

  setLearningRate(value) {
    this.learningRate = value;
  }

  setIterations(val) {
    this.iterations = val;
  }

  connectLayers() {
    // Connects current layer with the previous one. This is for a fully connected network
    // (each neuron connects with all the neurons from the previous layer)
    for (var layer = 1; layer < this.layers.length; layer++) {
      const thisLayer = this.layers[layer];
      const prevLayer = this.layers[layer - 1];
      for (var neuron = 0; neuron < prevLayer.neurons.length; neuron++) {
        for (
          var neuronInThisLayer = 0;
          neuronInThisLayer < thisLayer.neurons.length;
          neuronInThisLayer++
        ) {
          const connection = new Connection(
            prevLayer.neurons[neuron],
            thisLayer.neurons[neuronInThisLayer]
          );
          prevLayer.neurons[neuron].addOutputConnection(connection);
          thisLayer.neurons[neuronInThisLayer].addInputConnection(connection);
        }
      }
    }
  }

  // When training we will run this set of functions each time
  train(input, output) {
    // Set the input data on the first layer
    this.activate(input);

    // Forward propagate
    this.runInputSigmoid();

    console.log(
      'v.For input',
      input,
      'output',
      this.layers[this.layers.length - 1].neurons.map((n) => n.output),
      'expected',
      output
    );
    // backpropagate
    this.calculateDeltasSigmoid(output);
    this.adjustWeights();

    // You can use as a debugger
    // console.log(this.layers.map(l => l.toJSON()))

    this.setIterations(this.iterations + 1);
  }

  activate(values) {
    this.layers[0].neurons.forEach((n, i) => {
      n.setOutput(values[i]);
    });
  }

  run() {
    // For now we only use sigmoid function
    return this.runInputSigmoid();
  }

  runInputSigmoid() {
    for (var layer = 1; layer < this.layers.length; layer++) {
      for (
        var neuron = 0;
        neuron < this.layers[layer].neurons.length;
        neuron++
      ) {
        const bias = this.layers[layer].neurons[neuron].bias;
        // For each neuron in this layer we compute its output value,
        // the output value is obtained from all the connections comming to this neuron

        const connectionsValue = this.layers[layer].neurons[
          neuron
        ].inputConnections.reduce((prev, conn) => {
          const val = conn.weight * conn.from.output;
          return prev + val;
        }, 0);

        this.layers[layer].neurons[neuron].setOutput(
          sigmoid(bias + connectionsValue)
        );
      }
    }

    return this.layers[this.layers.length - 1].neurons.map((n) => n.output);
  }

  calculateDeltasSigmoid(target) {
    // calculates the needed change of weights for backpropagation, based on the error rate
    // It starts in the output layer and goes back to the first layer
    for (let layer = this.layers.length - 1; layer >= 0; layer--) {
      const currentLayer = this.layers[layer];

      for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
        const currentNeuron = currentLayer.neurons[neuron];
        console.log('v.calculateDeltas');
        console.log(JSON.stringify(currentNeuron, null, 2));
        let output = currentNeuron.output;

        let error = 0;
        if (layer === this.layers.length - 1) {
          // Is output layer,
          // the error is the difference between the expected result and the current output of this neuron
          error = target[neuron] - output;
          // console.log('calculate delta, error, last layer', error)
        } else {
          // Other than output layer
          // the error is the sum of all the products of the output connection neurons * the connections weight
          for (let k = 0; k < currentNeuron.outputConnections.length; k++) {
            const currentConnection = currentNeuron.outputConnections[k];
            console.log(
              'from [',
              currentNeuron.layer,
              ',',
              currentNeuron.row,
              '] to [',
              currentConnection.to.layer,
              ',',
              currentConnection.to.row,
              ']'
            );
            error += currentConnection.to.delta * currentConnection.weight;
            console.log(
              'to delta',
              currentConnection.to.delta,
              'conn weight',
              currentConnection.weight,
              'error',
              error
            );
            // console.log('calculate delta, error, inner layer', error)
          }
        }
        console.log('new error', error);
        currentNeuron.setError(error);
        console.log('new delta', error * output * (1 - output));
        currentNeuron.setDelta(error * output * (1 - output));
      }
    }
  }

  adjustWeights() {
    // we start adjusting weights from the output layer back to the input layer
    for (let layer = 1; layer <= this.layers.length - 1; layer++) {
      const prevLayer = this.layers[layer - 1];
      const currentLayer = this.layers[layer];

      for (let neuron = 0; neuron < currentLayer.neurons.length; neuron++) {
        const currentNeuron = currentLayer.neurons[neuron];
        let delta = currentNeuron.delta;

        for (let i = 0; i < currentNeuron.inputConnections.length; i++) {
          const currentConnection = currentNeuron.inputConnections[i];
          let change = currentConnection.change;

          // The change on the weight of this connection is:
          // the learningRate * the delta of the neuron * the output of the input neuron + (the connection change * momentum)
          change =
            this.learningRate * delta * currentConnection.from.output +
            this.momentum * change;
          // console.log('v.layer', layer, 'delta', delta, 'change', change);
          console.log('v.adjust');
          console.log(JSON.stringify(currentNeuron, null, 2));
          console.log(JSON.stringify(currentConnection, null, 2));
          console.log('set change', change);
          console.log('set weigth', currentConnection.weight + change);
          currentConnection.setChange(change);
          currentConnection.setWeight(currentConnection.weight + change);
        }
        console.log(
          'set neuron bias',
          currentNeuron.bias + this.learningRate * delta
        );
        currentNeuron.setBias(currentNeuron.bias + this.learningRate * delta);
      }
    }
  }
}

export default Network;
