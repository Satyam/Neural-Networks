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

const rxListOfIntegers = /^((\s*(\d+\s*\,\s*)*\d+\s*)|\s*)$/;
function initialize() {
  clearSVG();
  const hiddenLayers = document.getElementById('hiddenLayers').value.trim();
  if (!rxListOfIntegers.test(hiddenLayers)) {
    alert('Hidden layers must be a comma-separted list of positive integers');
    return;
  }
  const sizes = hiddenLayers
    ? hiddenLayers.split(',').map((size) => parseInt(size, 10))
    : [];
  if (sizes.some((size) => size < 2)) {
    alert('Hidden layers must have 2 or more neurons');
    return;
  }
  neuralNetwork = new NeuralNetwork(2, ...sizes, 4);
}

setupListeners();
initialize();

function train() {
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

function classifyPoints() {
  const dotColors = ['blue', 'green', 'red', 'purple'];
  function dotColor(output) {
    const maxIndex = output.indexOf(Math.max(...output));
    return dotColors[maxIndex];
  }
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
