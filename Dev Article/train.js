import { readFloat, readInt, getRandomPoint } from './utils.js';

export function train(neuralNetwork) {
  const trainingDataSize = readInt('#trainingDataSize');
  const learningRate = readFloat('#learningRate');
  const trainingIterations = readInt('#trainingIterations');

  const dotEncodings = [
    [1, 0, 0, 0], // BLUE
    [0, 1, 0, 0], // GREEN
    [0, 0, 1, 0], // RED
    [0, 0, 0, 1], // PURPLE
  ];

  const t1 = performance.now();

  const trainingData = Array.from(
    {
      // Adjust the number of data points as needed
      length: trainingDataSize,
    },
    () => {
      const [x, y] = getRandomPoint();

      const encoding =
        x < 0
          ? y < 0
            ? dotEncodings[0] // blue
            : dotEncodings[1] // green
          : y < 0
          ? dotEncodings[2] //red
          : dotEncodings[3]; // purple

      return { x, y, encoding };
    }
  );

  for (let i = trainingIterations; i--; ) {
    const { x, y, encoding } =
      trainingData[Math.floor(Math.random() * trainingDataSize)];
    neuralNetwork.train([x, y], encoding, learningRate);
  }
  console.log('train total', performance.now() - t1);
}
