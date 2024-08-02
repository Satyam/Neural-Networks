export const readInt = (selector) =>
  parseInt(document.querySelector(selector).value, 10);

export const readFloat = (selector) =>
  parseFloat(document.querySelector(selector).value);

export const linkButton = (selector, fn) =>
  document.querySelector(selector).addEventListener('click', fn);

export const sigmoid = (x) => 1 / (1 + Math.exp(-x));
