import {
  clearSVG,
  WIDTH,
  HEIGHT,
  appendToSVG,
  createSVGEl,
} from './graphics.js';

const VERTICAL_OFFSET = 100;
const NEURON_SIZE = 20;

function calculateNodes(neuralNetwork) {
  const nodes = [];
  const numLayers = neuralNetwork.numLayers;
  const w = WIDTH / numLayers;
  let maxSize = 0;
  for (let l = 0; l < numLayers; l++) {
    maxSize = Math.max(maxSize, neuralNetwork.getSize(l));
  }
  const ySpacing = (HEIGHT - VERTICAL_OFFSET) / maxSize;
  const xSpacing = WIDTH / numLayers;
  const xOffset = xSpacing / 2;
  for (let l = 0; l < numLayers; l++) {
    nodes[l] = [];
    const size = neuralNetwork.getSize(l);
    const yOffset = (HEIGHT + VERTICAL_OFFSET - ySpacing * size) / 2;
    for (let n = 0; n < size; n++) {
      nodes[l][n] = [l * xSpacing + xOffset, n * ySpacing + yOffset];
    }
  }
  return nodes;
}

function drawLabels(neuralNetwork, nodes, labels) {
  const numLayers = neuralNetwork.numLayers;
  const { top, input, output } = labels;
  const lbls = top
    ? top
    : Array.from({ length: numLayers }, (_, l) => `[${l}]`);
  appendToSVG(
    lbls.map((label, l) =>
      createSVGEl(
        'text',
        { x: nodes[l][0][0], y: VERTICAL_OFFSET / 2, class: 'toplabel' },
        label
      )
    )
  );
  if (input) {
    appendToSVG(
      input.map((label, i) => {
        const [x, y] = nodes[0][i];
        return createSVGEl(
          'text',
          { x, y: y - NEURON_SIZE * 1.5, class: 'inputlabel' },
          label ?? i
        );
      })
    );
  }
  if (output) {
    appendToSVG(
      output.map((label, i) => {
        const [x, y] = nodes[numLayers - 1][i];
        return createSVGEl(
          'text',
          { x, y: y - NEURON_SIZE * 1.5, class: 'outputlabel' },
          label ?? i
        );
      })
    );
  }
}

export function visualizeNetwork(neuralNetwork, labels = {}) {
  const nodes = calculateNodes(neuralNetwork);
  clearSVG();
  drawLabels(neuralNetwork, nodes, labels);
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
  let maxWeight = 0;
  const numLayers = neuralNetwork.numLayers;
  for (let l = 1; l < numLayers; l++) {
    const weights = neuralNetwork.getWeights(l);
    const inSize = neuralNetwork.getSize(l - 1);
    const outSize = neuralNetwork.getSize(l);
    for (let i = 0; i < inSize; i++) {
      for (let j = 0; j < outSize; j++) {
        drawWeight(nodes[l - 1][i], nodes[l][j], weights[j][i]);
        maxWeight = Math.max(Math.abs(weights[j][i]), maxWeight);
      }
    }
  }
  console.log({ maxWeight });
}

function drawWeight([x1, y1], [x2, y2], value) {
  appendToSVG(
    createSVGEl(
      'line',
      {
        x1,
        y1,
        x2,
        y2,
        stroke: rgb(value),
        class: 'weight',
      },
      createSVGEl('title', {}, value.toFixed(3))
    )
  );
}

function visualizeBiases(neuralNetwork, nodes) {
  let maxBias = 0;
  const numLayers = neuralNetwork.numLayers;
  for (let l = 1; l < numLayers; l++) {
    const size = neuralNetwork.getSize(l);
    const bias = neuralNetwork.getBiases(l);
    for (let n = 0; n < size; n++) {
      const [x, y] = nodes[l][n];
      drawBias(x, y, bias[n]);
      maxBias = Math.max(Math.abs(bias[n]), maxBias);
    }
  }
  console.log({ maxBias });
}

function drawBias(x, y, value) {
  appendToSVG(
    createSVGEl(
      'rect',
      {
        class: 'bias',
        x: x - NEURON_SIZE,
        y: y - NEURON_SIZE,
        width: NEURON_SIZE,
        height: 2 * NEURON_SIZE,
        fill: rgb(value),
      },
      createSVGEl('title', {}, value.toFixed(3))
    )
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
  appendToSVG(
    createSVGEl(
      'circle',
      {
        class: 'neuron',
        cx: x,
        cy: y,
        r: NEURON_SIZE / 2,
        fill: rgb(value),
      },
      createSVGEl(
        'title',
        {},
        typeof value === 'number' ? value.toFixed(3) : '??'
      )
    )
  );
}
