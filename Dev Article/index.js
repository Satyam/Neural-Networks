var neuralNetwork = '';

function readInt(selector) {
  return parseInt(document.querySelector(selector).value, 10);
}

function initialise() {
  clearCanvas();
  neuralNetwork = new NeuralNetwork(2, readInt('#hiddenNodes'), 4);
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

      let label;
      if (x <= 0 && y < 0) {
        label = 'blue';
      } else if (x <= 0 && y > 0) {
        label = 'green';
      } else if (x > 0 && y <= 0) {
        label = 'red';
      } else {
        label = 'purple';
      }
      return { x, y, label };
    }
  );
  for (let i = readInt('#trainingIterations'); i--; ) {
    const { x, y, label } =
      trainingData[Math.floor(Math.random() * trainingData.length)];
    neuralNetwork.train([x, y], oneHotEncode(label));
  }
}

function classifyPoints() {
  clearCanvas();
  drawAxes();
  for (let i = readInt('#numPoints'); i--; ) {
    const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
    const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
    const output = neuralNetwork.feedForward([x, y]);
    const predictedLabel = oneHotDecode(output);
    drawPoint(x, y, predictedLabel);
  }
}

function oneHotEncode(label) {
  const encoding = {
    blue: [1, 0, 0, 0],
    red: [0, 1, 0, 0],
    green: [0, 0, 1, 0],
    purple: [0, 0, 0, 1],
  };
  return encoding[label];
}

function oneHotDecode(output) {
  const labels = ['blue', 'red', 'green', 'purple'];
  const maxIndex = output.indexOf(Math.max(...output));
  return labels[maxIndex];
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
