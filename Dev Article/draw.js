import { svg, WIDTH, HEIGHT, appendSVGEl } from './graphics.js';

const pointRadius = 5; // Radius of the points

export function drawPoint(x, y, color) {
  appendSVGEl(svg, 'circle', {
    cx: ((x + 1) * WIDTH) / 2,
    cy: HEIGHT - ((y + 1) * HEIGHT) / 2,
    class: 'point',
    fill: color,
  });
}

export function drawAxes() {
  appendSVGEl(svg, 'line', {
    x1: 0,
    y1: HEIGHT / 2,
    x2: WIDTH,
    y2: HEIGHT / 2,
    class: 'axis',
  });
  appendSVGEl(svg, 'line', {
    x1: WIDTH / 2,
    y1: 0,
    x2: WIDTH / 2,
    y2: HEIGHT,
    class: 'axis',
  });
}
