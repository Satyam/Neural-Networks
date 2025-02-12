import { readFloat, readInt, getRandomPoint, outputEncoding } from './utils.js';

export function train(neuralNetwork) {
  const trainingDataSize = readInt('#trainingDataSize');
  const learningRate = readFloat('#learningRate');
  const trainingIterations = readInt('#trainingIterations');

  const t1 = performance.now();

  const trainingData = Array.from(
    {
      // Adjust the number of data points as needed
      length: trainingDataSize,
    },
    () => {
      const [x, y] = getRandomPoint();

      return { x, y, encoding: outputEncoding(x, y) };
    }
  );

  for (let i = trainingIterations; i--; ) {
    const { x, y, encoding } =
      trainingData[Math.floor(Math.random() * trainingDataSize)];
    neuralNetwork.train([x, y], encoding, learningRate);
  }
  console.log('train total', performance.now() - t1);
}
