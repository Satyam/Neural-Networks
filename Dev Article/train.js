import { readFloat, readInt, getRandomPoint, outputEncoding } from './utils.js';

export function train(neuralNetwork) {
  const trainingDataSize = readInt('#trainingDataSize');
  const learningRate = readFloat('#learningRate');
  const repetitions = readInt('#repetitions');

  const t1 = performance.now();

  if (repetitions > 1) {
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

    for (let i = repetitions * trainingDataSize; i--; ) {
      const { x, y, encoding } =
        trainingData[Math.floor(Math.random() * trainingDataSize)];
      neuralNetwork.train([x, y], encoding, learningRate);
    }
  } else {
    for (let i = trainingDataSize; i--; ) {
      const [x, y] = getRandomPoint();
      neuralNetwork.train([x, y], outputEncoding(x, y), learningRate);
    }
  }
  console.log('train total', performance.now() - t1);
}
