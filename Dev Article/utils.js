export const readInt = (selector) =>
  parseInt(document.querySelector(selector).value, 10);

export const readFloat = (selector) =>
  parseFloat(document.querySelector(selector).value);

export const linkButton = (selector, fn) =>
  document.querySelector(selector).addEventListener('click', fn);

export const sigmoid = (x) => 1 / (1 + Math.exp(-x));

export const randomCoeficient = () => Math.random() * 2 - 1;

export const getRandomPoint = () => [
  randomCoeficient(), // Random x-coordinate between -1 and 1
  randomCoeficient(), // Random y-coordinate between -1 and 1
];

const outputEncodings = [
  [1, 0, 0, 0], // BLUE
  [0, 1, 0, 0], // GREEN
  [0, 0, 1, 0], // RED
  [0, 0, 0, 1], // PURPLE
];

export const outputEncoding = (x, y) =>
  x < 0
    ? y < 0
      ? outputEncodings[0] // blue
      : outputEncodings[1] // green
    : y < 0
    ? outputEncodings[2] //red
    : outputEncodings[3]; // purple
