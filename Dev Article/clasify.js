import { WIDTH, HEIGHT, appendToSVG, createSVGEl, clearSVG } from './svg.js';
import { readInt, getRandomPoint, outputEncoding } from './utils.js';

export function classify(neuralNetwork) {
  const dotColors = ['blue', 'green', 'red', 'purple'];
  const numPoints = readInt('#numPoints');
  function outputIndex(output) {
    return output.indexOf(Math.max(...output));
  }

  clearSVG();
  drawAxes();
  const t1 = performance.now();

  let success = 0;
  for (let i = numPoints; i--; ) {
    const [x, y] = getRandomPoint();
    const expectedOutput = outputEncoding(x, y);
    const expectedIndex = outputIndex(expectedOutput);
    const output = neuralNetwork.feedForward([x, y]);
    const nodeIndex = outputIndex(output);
    drawPoint(x, y, dotColors[nodeIndex]);
    if (nodeIndex === expectedIndex) success++;
  }
  document.getElementById('success').innerText = `Success: ${(
    (success / numPoints) *
    100
  ).toFixed(2)}%`;
  console.log('classify total', performance.now() - t1);
}

function drawPoint(x, y, color) {
  appendToSVG(
    createSVGEl(
      'circle',
      {
        cx: ((x + 1) * WIDTH) / 2,
        cy: ((1 - y) * HEIGHT) / 2,
        class: 'point',
        fill: color,
      },
      [createSVGEl('title', {}, `[${x.toFixed(3)}, ${y.toFixed(3)}]`)]
    )
  );
}

function drawAxes() {
  appendToSVG([
    createSVGEl('line', {
      x1: 0,
      y1: HEIGHT / 2,
      x2: WIDTH,
      y2: HEIGHT / 2,
      class: 'axis',
    }),
    createSVGEl('line', {
      x1: WIDTH / 2,
      y1: 0,
      x2: WIDTH / 2,
      y2: HEIGHT,
      class: 'axis',
    }),
  ]);
}
