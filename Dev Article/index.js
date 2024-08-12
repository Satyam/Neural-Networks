import { NeuralNetwork } from './neuralNetwork.js';
import { clearSVG } from './graphics.js';
import { drawAxes, drawPoint } from './draw.js';
import { visualizeNetwork } from './visualize.js';
import { readFloat, readInt, linkButton } from './utils.js';

let neuralNetwork = '';

function setupListeners() {
  linkButton('#initialize', initialize);
  linkButton('#train', train);
  linkButton('#classify', classifyPoints);
  linkButton('#visualize', visualize);
}

function initialize() {
  clearSVG();
  const hiddenLayers = document.getElementById('hiddenLayers').value.trim();
  const sizes = hiddenLayers
    ? hiddenLayers.split(',').map((size) => {
        size = parseInt(size, 10);
        if (Number.isNaN(size)) {
          alert('Hidden layers must be a comma-separted list of integers');
          throw new Error(
            'Hidden layers must be a comma-separted list of integers'
          );
        }
        return size;
      })
    : null;
  neuralNetwork = sizes
    ? new NeuralNetwork(2, ...sizes, 4)
    : new NeuralNetwork(2, 4);
}

const DOTS = {
  BLUE: 0,
  GREEN: 1,
  RED: 2,
  PURPLE: 3,
};

const dotColors = ['blue', 'green', 'red', 'purple'];

const dotEncodings = [
  [1, 0, 0, 0], // BLUE
  [0, 1, 0, 0], // GREEN
  [0, 0, 1, 0], // RED
  [0, 0, 0, 1], // PURPLE
];

function dotEncode(type) {
  return dotEncodings[type];
}

function dotColor(output) {
  const maxIndex = output.indexOf(Math.max(...output));
  return dotColors[maxIndex];
}

setupListeners();
initialize();

function train() {
  const trainingData = Array.from(
    {
      // Adjust the number of data points as needed
      length: readInt('#trainingDataSize'),
    },
    () => {
      const x = Math.random() * 2 - 1; // Random x value between -1 and 1
      const y = Math.random() * 2 - 1; // Random y value between -1 and 1

      let type;
      if (x <= 0 && y < 0) {
        type = DOTS.BLUE;
      } else if (x <= 0 && y > 0) {
        type = DOTS.GREEN;
      } else if (x > 0 && y <= 0) {
        type = DOTS.RED;
      } else {
        type = DOTS.PURPLE;
      }
      return { x, y, type };
    }
  );
  const learningRate = readFloat('#learningRate');
  const t1 = performance.now();
  for (let i = readInt('#trainingIterations'); i--; ) {
    const { x, y, type } =
      trainingData[Math.floor(Math.random() * trainingData.length)];
    neuralNetwork.train([x, y], dotEncode(type), learningRate);
  }
  console.log('train total', performance.now() - t1);
}

function classifyPoints() {
  clearSVG();
  drawAxes();
  const t1 = performance.now();

  for (let i = readInt('#numPoints'); i--; ) {
    const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
    const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
    const output = neuralNetwork.feedForward([x, y]);
    const predictedColor = dotColor(output);
    drawPoint(x, y, predictedColor);
  }
  console.log('classify total', performance.now() - t1);
}

function visualize() {
  visualizeNetwork(neuralNetwork, {
    input: ['X', 'Y'],
    output: ['Green (TL)', 'Purple (TR)', 'Blue (BL)', 'Red (BR)'],
  });
}
