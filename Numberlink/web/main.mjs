import { generate } from './gen.mjs';

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

const generateBtn = document.getElementById('generate');
const solveBtn = document.getElementById('solve');

generateBtn.addEventListener('click', () => {
  const width = widthInput.valueAsNumber;
  const height = heightInput.valueAsNumber;
  const [pzzl, sltn] = generate(width, height);
  console.log(JSON.stringify(pzzl));
  console.log('--------');
  console.log(JSON.stringify(sltn));
});
