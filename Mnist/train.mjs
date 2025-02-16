import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { NeuralNetwork } from '../Dev Article/neuralNetwork.js';

const neuralNetwork = new NeuralNetwork(784, 15, 10);

const decodeLine = (line) => line.split(',').map((v) => parseInt(v, 10));

const encodeValue = (value) =>
  Array.from({ length: 10 }, (_, i) => (value === i ? 1 : 0));

const decodeValue = (output) => output.indexOf(Math.max(...output));

await train(neuralNetwork, './mnist_train.csv', 3);
await test(neuralNetwork, './mnist_test.csv');

function train(
  neuralNetwork,
  fileName,
  learningRate,
  limit = Number.MAX_SAFE_INTEGER
) {
  return new Promise((resolve) => {
    const readTrainLine = createInterface({
      input: createReadStream(fileName),
      crlfDelay: Infinity,
    });
    const tTrain = performance.now();
    readTrainLine.on('line', (line) => {
      if (limit) {
        limit--;
        const [value, ...pixels] = decodeLine(line);
        neuralNetwork.train(pixels, encodeValue(value), learningRate);
      } else {
        readTrainLine.close();
      }
    });
    readTrainLine.on('close', () => {
      console.log('Train Total Time', (performance.now() - tTrain).toFixed(0));
      resolve();
    });
  });
}

function test(neuralNetwork, filename) {
  return new Promise((resolve) => {
    const readTestLine = createInterface({
      input: createReadStream(filename),
      crlfDelay: Infinity,
    });
    let numTests = 0;
    let success = 0;
    const tTest = performance.now();
    readTestLine.on('line', (line) => {
      numTests++;
      const [value, ...pixels] = decodeLine(line);
      const found = neuralNetwork.feedForward(pixels);
      if (value === decodeValue(found)) success++;
    });

    readTestLine.on('close', () => {
      console.log(
        `Test total time: ${(performance.now() - tTest).toFixed(0)}
Success: ${((success / numTests) * 100).toFixed(2)}%`
      );
      resolve(success);
    });
  });
}
