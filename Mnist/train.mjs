import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { NeuralNetwork } from '../Dev Article/neuralNetwork.js';

const readTrainLine = createInterface({
  input: createReadStream('./mnist_train.csv'),
  crlfDelay: Infinity,
});

const neuralNetwork = new NeuralNetwork(784, 15, 10);

const output = Array(10).fill(0);
let prevVal = 0;
let limit = 1000;
const tTrain = performance.now();
readTrainLine.on('line', (line) => {
  if (limit) {
    limit--;
    const [value, ...pixels] = line.split(',');
    output[prevVal] = 0;
    output[value] = 1;
    prevVal = value;
    neuralNetwork.train(pixels, output, 0.1);
  } else {
    readTrainLine.close();
  }
});
readTrainLine.on('close', () => {
  console.log('train total', performance.now() - tTrain);

  const readTestLine = createInterface({
    input: createReadStream('./mnist_test.csv'),
    crlfDelay: Infinity,
  });
  const tTest = performance.now();
  let numTests = 0;
  let success = 0;
  readTestLine.on('line', (line) => {
    numTests++;
    const [value, ...pixels] = line.split(',');
    output[prevVal] = 0;
    output[value] = 1;
    prevVal = value;
    const found = neuralNetwork.feedForward(pixels);
    if (value === output.indexOf(Math.max(...found))) success++;
  });

  readTestLine.on('close', () => {
    console.log(
      'test total',
      performance.now() - tTest,
      'success',
      success / numTests
    );
  });
});
