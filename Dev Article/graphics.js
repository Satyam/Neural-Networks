const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const pointRadius = 5; // Radius of the points

function drawPoint(x, y, color) {
  ctx.beginPath();
  ctx.arc(
    ((x + 1) * canvas.width) / 2,
    canvas.height - ((y + 1) * canvas.height) / 2,
    pointRadius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2); // X-axis
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height); // Y-axis
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath();
}
function visualizeNeuronsAndWeights() {
  clearCanvas(); // Clear the canvas
  visualizeLayer(100, 100, neuralNetwork.inputSize, 'grey', 'Input');
  visualizeLayer(300, 100, neuralNetwork.hiddenSize, 'aqua', 'Hidden', true);
  visualizeLayer(500, 100, neuralNetwork.outputSize, 'red', 'Output');
  visualizeWeights();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function visualizeLayer(startX, startY, neuronCount, color, label, showBias) {
  const neuronSpacing = 100;
  const neuronRadius = 20;

  for (let i = 0; i < neuronCount; i++) {
    const x = startX;
    const y = startY + i * neuronSpacing;
    drawNeuron(x, y, neuronRadius, color, label);
    if (showBias) {
      drawBias(x, y, neuralNetwork.biasHidden[i]);
    }
    if (label === 'Input') {
      drawInputToHiddenWeights(x, y);
    }
  }
}

function drawInputToHiddenWeights(inputX, hiddenY) {
  for (let i = 0; i < neuralNetwork.inputSize; i++) {
    for (let j = 0; j < neuralNetwork.hiddenSize; j++) {
      const weight = neuralNetwork.weightsInputToHidden[j][i];
      const fromX = inputX;
      const fromY = hiddenY;
      const toX = 300;
      const toY = 100 + j * 100;
      drawWeight(fromX, fromY, toX, toY, weight, 'red');
    }
  }
}

function visualizeWeights() {
  for (let i = 0; i < neuralNetwork.outputSize; i++) {
    for (let j = 0; j < neuralNetwork.hiddenSize; j++) {
      const weight = neuralNetwork.weightsHiddenToOutput[i][j];
      const fromX = 300;
      const fromY = 100 + j * 100; // Increase vertical spacing
      const toX = 500;
      const toY = 100 + i * 100; // Increase vertical spacing
      drawWeight(fromX, fromY, toX, toY, weight);
    }
  }
}

function drawNeuron(x, y, radius, color, label) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(label, x - 15, y + 5);
  ctx.closePath();
}

function drawBias(x, y, bias) {
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Bias: ' + bias.toFixed(2), x - 50, y + 30);
}

var yOffset = 0;

function drawWeight(fromX, fromY, toX, toY, weight, color) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color || 'green';
  ctx.stroke();

  const textX = (fromX + toX) / 2;
  const textY = (fromY + toY) / 2 + toY / 3;
  ctx.font = '14px Arial';
  ctx.fillStyle = 'green';
  ctx.fillText(weight.toFixed(2), textX, textY);
  ctx.closePath();
}
