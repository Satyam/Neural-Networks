import {
  width,
  height,
  ctx,
  clearCanvas,
  clearSVG,
  svg,
  WIDTH,
  HEIGHT,
  appendSVGEl,
} from './graphics.js';

const VERTICAL_OFFSET = 100;
const NEURON_SIZE = 20;

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

function drawLabels(neuralNetwork, nodes, labels) {
  ctx.save();
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = 'black';

  const numLayers = neuralNetwork.numLayers;
  const { top, input, output } = labels;
  const lbls = top
    ? top
    : Array.from({ length: numLayers }, (_, l) => `[${l}]`);
  ctx.textAlign = 'center';
  lbls.forEach((label, l) => {
    ctx.fillText(label, nodes[l][0][0], VERTICAL_OFFSET / 2);
    appendSVGEl(
      svg,
      'text',
      { x: nodes[l][0][0], y: VERTICAL_OFFSET / 2, class: 'toplabel' },
      label
    );
  });
  if (input) {
    ctx.textAlign = 'right';
    input.forEach((label, i) => {
      const [x, y] = nodes[0][i];
      ctx.fillText(label ?? i, x, y - NEURON_SIZE * 1.5);
      appendSVGEl(
        svg,
        'text',
        { x, y: y - NEURON_SIZE * 1.5, class: 'inputlabel' },
        label ?? i
      );
    });
  }
  if (output) {
    ctx.textAlign = 'left';
    output.forEach((label, i) => {
      const [x, y] = nodes[numLayers - 1][i];
      ctx.fillText(label ?? i, x, y - NEURON_SIZE * 1.5);
      appendSVGEl(
        svg,
        'text',
        { x, y: y - NEURON_SIZE * 1.5, class: 'outputlabel' },
        label ?? i
      );
    });
  }
  ctx.restore();
}
export function visualizeNetwork(neuralNetwork, labels = {}) {
  const nodes = calculateNodes(neuralNetwork);
  clearCanvas();
  clearSVG();
  drawLabels(neuralNetwork, nodes, labels);
  ctx.font = '14px Arial';
  visualizeWeights(neuralNetwork, nodes);
  visualizeBiases(neuralNetwork, nodes);
  visualizeLayers(neuralNetwork, nodes);
}

const rgb = (value) => `rgb(
  ${value < 0 ? Math.floor(-value * 255) : 0} 
  0 
  ${value > 0 ? Math.floor(value * 255) : 0}
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

function drawWeight([x1, y1], [x2, y2], value) {
  ctx.beginPath();
  ctx.strokeStyle = rgb(value);
  ctx.lineWidth = 5;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(value.toFixed(3), (x1 + x2) / 2, (y1 + y2) / 2);
  ctx.closePath();
  const g = appendSVGEl(svg, 'g', { class: 'weight' });
  appendSVGEl(g, 'line', {
    x1,
    y1,
    x2,
    y2,
    stroke: rgb(value),
  });
  appendSVGEl(
    g,
    'text',
    {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    },
    value.toFixed(3)
  );
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
  ctx.fillStyle = rgb(value);
  ctx.fillRect(x - NEURON_SIZE, y - NEURON_SIZE, NEURON_SIZE, 2 * NEURON_SIZE);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(value.toFixed(3), x + 1, y - NEURON_SIZE);
  ctx.closePath();
  const g = appendSVGEl(svg, 'g', {
    class: 'bias',
  });
  appendSVGEl(g, 'rect', {
    x: x - NEURON_SIZE,
    y: y - NEURON_SIZE,
    width: NEURON_SIZE,
    height: 2 * NEURON_SIZE,
    fill: rgb(value),
  });
  appendSVGEl(
    g,
    'text',
    {
      x: x + 1,
      y: y - NEURON_SIZE,
    },
    value.toFixed(3)
  );
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
  ctx.arc(x, y, NEURON_SIZE / 2, 0, 2 * Math.PI);
  ctx.fillStyle = rgb(value);
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(
    typeof value === 'number' ? value.toFixed(3) : '??',
    x + NEURON_SIZE,
    y
  );
  ctx.closePath();
  const g = appendSVGEl(svg, 'g', {
    class: 'bias',
  });
  appendSVGEl(g, 'circle', {
    cx: x,
    cy: y,
    r: NEURON_SIZE / 2,
    fill: rgb(value),
  });
  appendSVGEl(
    g,
    'text',
    {
      x: x + NEURON_SIZE,
      y,
    },
    typeof value === 'number' ? value.toFixed(3) : '??'
  );
}
