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
