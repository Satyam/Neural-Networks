import { WIDTH, HEIGHT, appendToSVG, createSVGEl, clearSVG } from './svg.js';
import { readInt, getRandomPoint } from './utils.js';

export function classify(neuralNetwork) {
  const dotColors = ['blue', 'green', 'red', 'purple'];
  const numPoints = readInt('#numPoints');
  function dotColor(output) {
    const maxIndex = output.indexOf(Math.max(...output));
    return dotColors[maxIndex];
  }
  clearSVG();
  drawAxes();
  const t1 = performance.now();

  for (let i = numPoints; i--; ) {
    const [x, y] = getRandomPoint();
    const output = neuralNetwork.feedForward([x, y]);
    const predictedColor = dotColor(output);
    drawPoint(x, y, predictedColor);
  }
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
