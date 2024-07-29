let neuralNetwork = '';
let nn = '';

function readInt(selector) {
  return parseInt(document.querySelector(selector).value, 10);
}

function readFloat(selector) {
  return parseFloat(document.querySelector(selector).value);
}
function initialise() {
  clearCanvas();
  neuralNetwork = new NeuralNetwork(2, readInt('#hiddenNodes'), 4);
  nn = new NN(2, 8, 4);
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

initialise();

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
    nn.train([x, y], dotEncode(type), learningRate);
  }
  // Matrix.xxx();
  // Vector.xxx();
  console.log('train total', performance.now() - t1);
}

function classifyPoints() {
  clearCanvas();
  drawAxes();
  const t1 = performance.now();

  for (let i = readInt('#numPoints'); i--; ) {
    const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
    const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
    const output = nn.feedForward([x, y]); //.toArray();
    // const output = nn.feedForward([x, y]);
    const predictedColor = dotColor(output);
    drawPoint(x, y, predictedColor);
  }
  // Matrix.xxx();
  // Vector.xxx();
  console.log('classify total', performance.now() - t1);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
