import { width, height, ctx } from './graphics.js';

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
}
