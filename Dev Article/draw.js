import { WIDTH, HEIGHT, appendToSVG, createSVGEl } from './graphics.js';

export function drawPoint(x, y, color) {
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

export function drawAxes() {
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
