import { width, height, ctx, clearCanvas } from './graphics.js';

const VERTICAL_OFFSET = 100;

function calculateNodes(neuralNetwork) {
  const nodes = [];
  const numLayers = neuralNetwork.numLayers;
  const w = width / numLayers;
  let maxSize = 0;
  for (let l = 0; l < numLayers; l++) {
    maxSize = Math.max(maxSize, neuralNetwork.getSize(l));
  }
  const ySpacing = (height - VERTICAL_OFFSET) / maxSize;
  const xSpacing = width / numLayers;
  const xOffset = xSpacing / 2;
  for (let l = 0; l < numLayers; l++) {
    nodes[l] = [];
    const size = neuralNetwork.getSize(l);
    const yOffset = (height + VERTICAL_OFFSET - ySpacing * size) / 2;
    for (let n = 0; n < size; n++) {
      nodes[l][n] = [l * xSpacing + xOffset, n * ySpacing + yOffset];
    }
  }
  return nodes;
}

function drawLabels(neuralNetwork, nodes) {
  const numLayers = neuralNetwork.numLayers;
  let label;
  ctx.font = '14px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  for (let l = 0; l < numLayers; l++) {
    switch (l) {
      case 0:
        label = 'Input';
        break;
      case numLayers - 1:
        label = 'Output';
        break;
      default:
        label = `[${l}]`;
    }
    ctx.fillText(label, nodes[l][0][0], VERTICAL_OFFSET / 2);
  }
}
export function visualizeNetwork(neuralNetwork) {
  const nodes = calculateNodes(neuralNetwork);
  clearCanvas();
  drawLabels(neuralNetwork, nodes);
  visualizeWeights(neuralNetwork, nodes);
  visualizeBiases(neuralNetwork, nodes);
  visualizeLayers(neuralNetwork, nodes);
}

const rgb = (value) => `rgb(
  ${value < 0 ? -value * 255 : 0}
  0
  ${value > 0 ? value * 255 : 0}
)`;

function visualizeWeights(neuralNetwork, nodes) {
  const numLayers = neuralNetwork.numLayers;
  for (let l = 1; l < numLayers; l++) {
    const weights = neuralNetwork.getWeights(l);
    const inSize = neuralNetwork.getSize(l - 1);
    const outSize = neuralNetwork.getSize(l);
    for (let i = 0; i < inSize; i++) {
      for (let j = 0; j < outSize; j++) {
        drawWeight(nodes[l - 1][i], nodes[l][j], weights[j][i]);
      }
    }
  }
}

function drawWeight(src, dest, value) {
  ctx.beginPath();
  ctx.strokeStyle = rgb(value);
  ctx.lineWidth = 5;
  ctx.moveTo(...src);
  ctx.lineTo(...dest);
  ctx.stroke();
  ctx.closePath();
}

function visualizeBiases(neuralNetwork, nodes) {
  const numLayers = neuralNetwork.numLayers;
  for (let l = 1; l < numLayers; l++) {
    const size = neuralNetwork.getSize(l);
    const bias = neuralNetwork.getBiases(l);
    for (let n = 0; n < size; n++) {
      const [x, y] = nodes[l][n];
      drawBias(x, y, bias[n]);
    }
  }
}

function drawBias(x, y, value) {
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fillStyle = rgb(value);
  ctx.fill();
  // ctx.strokeStyle = 'white';
  // ctx.stroke();
  ctx.closePath();
}

function visualizeLayers(neuralNetwork, nodes) {
  const numLayers = neuralNetwork.numLayers;
  for (let l = 0; l < numLayers; l++) {
    const size = neuralNetwork.getSize(l);
    const layer = neuralNetwork.getLayer(l);
    for (let n = 0; n < size; n++) {
      const [x, y] = nodes[l][n];
      drawNeuron(x, y, layer[n]);
    }
  }
}

function drawNeuron(x, y, value) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = rgb(value);
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}

function drawText(x, y, text, align) {}
