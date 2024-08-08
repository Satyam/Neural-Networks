import {
  width,
  height,
  ctx,
  svg,
  WIDTH,
  HEIGHT,
  appendSVGEl,
} from './graphics.js';

const pointRadius = 5; // Radius of the points

export function drawPoint(x, y, color) {
  ctx.beginPath();
  ctx.arc(
    ((x + 1) * width) / 2,
    height - ((y + 1) * height) / 2,
    pointRadius,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  //--------------------------------
  appendSVGEl(svg, 'circle', {
    cx: ((x + 1) * WIDTH) / 2,
    cy: HEIGHT - ((y + 1) * HEIGHT) / 2,
    class: 'point',
    fill: color,
  });
}

export function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2); // X-axis
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height); // Y-axis
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath();
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
