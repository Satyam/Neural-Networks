import { width, height, ctx, clearCanvas } from './graphics.js';

export function visualizeNetwork(neuralNetwork) {
  clearCanvas(); // Clear the canvas
  drawText(100, 50, 'Input', 'center');
  visualizeLayer(100, neuralNetwork.inputSize, 'grey', 'Input');
  drawText(300, 50, 'Hidden', 'center');
  visualizeLayer(300, neuralNetwork.hiddenSize, 'aqua', 'Hidden', true);
  drawText(500, 50, 'Output', 'center');
  visualizeLayer(500, neuralNetwork.outputSize, 'red', 'Output');
  visualizeWeights();
}

function visualizeLayer(startX, neuronCount, color, label, showBias) {
  const neuronRadius = 20;
  const neuronSpacing = height / (neuronCount + 1);

  let y = (height - (neuronCount - 1) * neuronSpacing) / 2;
  for (let i = 0; i < neuronCount; i++, y += neuronSpacing) {
    drawNeuron(startX, y, neuronRadius, color);
    if (showBias) {
      drawBias(startX, y, neuralNetwork.biasHidden[i]);
    }
    if (label === 'Input') {
      drawInputToHiddenWeights(startX, y);
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

function drawNeuron(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath();
}

function drawText(x, y, text, align) {
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  if (align) ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function drawBias(x, y, bias) {
  drawText('Bias: ' + bias.toFixed(2), x - 50, y + 30);
}

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
