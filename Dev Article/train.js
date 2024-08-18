import { readFloat, readInt } from './utils.js';

export function train(neuralNetwork) {
  const t1 = performance.now();
  const trainingDataSize = readInt('#trainingDataSize');
  const dotEncodings = [
    [1, 0, 0, 0], // BLUE
    [0, 1, 0, 0], // GREEN
    [0, 0, 1, 0], // RED
    [0, 0, 0, 1], // PURPLE
  ];
  const trainingData = Array.from(
    {
      // Adjust the number of data points as needed
      length: trainingDataSize,
    },
    () => {
      const x = Math.random() * 2 - 1; // Random x value between -1 and 1
      const y = Math.random() * 2 - 1; // Random y value between -1 and 1

      let encoding;
      if (x <= 0 && y < 0) {
        encoding = dotEncodings[0]; // blue
      } else if (x <= 0 && y > 0) {
        encoding = dotEncodings[1]; // green
      } else if (x > 0 && y <= 0) {
        encoding = dotEncodings[2]; //red
      } else {
        encoding = dotEncodings[3]; // purple
      }
      return { x, y, encoding };
    }
  );
  const learningRate = readFloat('#learningRate');
  for (let i = readInt('#trainingIterations'); i--; ) {
    const { x, y, encoding } =
      trainingData[Math.floor(Math.random() * trainingDataSize)];
    neuralNetwork.train([x, y], encoding, learningRate);
  }
  console.log('train total', performance.now() - t1);
}
