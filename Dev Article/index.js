import { NeuralNetwork } from './neuralNetwork.js';
import { clearSVG } from './graphics.js';
import { classify } from './clasify.js';
import { visualizeNetwork } from './visualize.js';
import { train } from './train.js';
import { linkButton } from './utils.js';

let neuralNetwork = '';

function setupListeners() {
  linkButton('#initialize', initialize);
  linkButton('#train', trainNetwork);
  linkButton('#classify', classifyPoints);
  linkButton('#visualize', visualize);
}

const rxListOfIntegers = /^((\s*(\d+\s*\,\s*)*\d+\s*)|\s*)$/;
function initialize() {
  clearSVG();
  const hiddenLayers = document.getElementById('hiddenLayers').value.trim();
  if (!rxListOfIntegers.test(hiddenLayers)) {
    alert('Hidden layers must be a comma-separted list of positive integers');
    return;
  }
  const sizes = hiddenLayers
    ? hiddenLayers.split(',').map((size) => parseInt(size, 10))
    : [];
  if (sizes.some((size) => size < 2)) {
    alert('Hidden layers must have 2 or more neurons');
    return;
  }
  neuralNetwork = new NeuralNetwork(2, ...sizes, 4);
}

setupListeners();
initialize();

function trainNetwork() {
  train(neuralNetwork);
}

function classifyPoints() {
  classify(neuralNetwork);
}

function visualize() {
  visualizeNetwork(neuralNetwork, {
    input: ['X', 'Y'],
    output: ['Green (TL)', 'Purple (TR)', 'Blue (BL)', 'Red (BR)'],
  });
}
