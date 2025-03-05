import Neuron from './neuron.mjs';

class Layer {
  constructor(numberOfNeurons) {
    const neurons = [];
    for (let j = 0; j < numberOfNeurons; j++) {
      const neuron = new Neuron();
      neurons.push(neuron);
    }

    this.neurons = neurons;
  }

  toJSON() {
    return this.neurons.map((n) => {
      return n.toJSON();
    });
  }
}

export default Layer;
