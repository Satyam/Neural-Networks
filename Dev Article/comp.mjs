import { NeuralNetwork } from './neuralNetwork.js';
import NN from './venture/network.mjs';
const trainingData = [
  {
    input: [0, 0],
    output: [0, 0],
  },
  {
    input: [0, 1],
    output: [1, 0],
  },
  {
    input: [1, 0],
    output: [1, 0],
  },
  {
    input: [1, 1],
    output: [0, 1],
  },
];

for (const { input, output } of trainingData) {
  const net = new NeuralNetwork([2, 2, 2]);
  net.train(input, output, 1);

  const network = new NN([2, 2, 2]);

  network.setLearningRate(1);
  network.train(input, output);
}
