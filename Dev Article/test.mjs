import { test, describe, before, after } from 'node:test';
import { equal } from 'node:assert/strict';

import { NeuralNetwork } from './neuralNetwork.js';

describe('XOR Gate', () => {
  let network;

  // Training data for a xor gate
  const trainingData = [
    {
      input: [0, 0],
      output: [0],
    },
    {
      input: [0, 1],
      output: [1],
    },
    {
      input: [1, 0],
      output: [1],
    },
    {
      input: [1, 1],
      output: [0],
    },
  ];

  before(async () => {
    // Create the network
    network = new NeuralNetwork([2, 10, 10, 1]);

    // Set a learning rate
    network.learningRate = 0.3;

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });

  test('should return 0 for a [0,0] input', () => {
    network.feedForward([0, 0]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 0);
  });

  test('should return 1 for a [0,1] input', () => {
    network.feedForward([0, 1]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 1);
  });

  test('should return 1 for a [1,0] input', () => {
    network.feedForward([1, 0]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 1);
  });

  test('should return 0 for a [1,1] input', () => {
    network.feedForward([1, 1]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 0);
  });
});

describe('AND Gate', () => {
  let network;
  // Training data for an and gate
  const trainingData = [
    {
      input: [0, 0],
      output: [0],
    },
    {
      input: [0, 1],
      output: [0],
    },
    {
      input: [1, 0],
      output: [0],
    },
    {
      input: [1, 1],
      output: [1],
    },
  ];

  before(async () => {
    // Create the network
    network = new NeuralNetwork([2, 10, 10, 1]);

    // Set a learning rate
    network.learningRate = 0.3;

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });

  test('should return 0 for a [0,0] input', () => {
    network.feedForward([0, 0]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 0);
  });

  test('should return 0 for a [0,1] input', () => {
    network.feedForward([0, 1]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 0);
  });

  test('should return 0 for a [1,0] input', () => {
    network.feedForward([1, 0]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 0);
  });

  test('should return 1 for a [1,1] input', () => {
    network.feedForward([1, 1]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 1);
  });
});

describe('OR Gate', () => {
  let network;

  // Training data for a xor gate
  const trainingData = [
    {
      input: [0, 0],
      output: [0],
    },
    {
      input: [0, 1],
      output: [1],
    },
    {
      input: [1, 0],
      output: [1],
    },
    {
      input: [1, 1],
      output: [1],
    },
  ];

  before(async () => {
    // Create the network
    network = new NeuralNetwork([2, 10, 10, 1]);

    // Set a learning rate
    network.learningRate = 0.3;

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });
  test('should return 0 for a [0,0] input', () => {
    network.feedForward([0, 0]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 0);
  });

  test('should return 1 for a [0,1] input', () => {
    network.feedForward([0, 1]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 1);
  });

  test('should return 1 for a [1,0] input', () => {
    network.feedForward([1, 0]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 1);
  });

  test('should return 1 for a [1,1] input', () => {
    network.feedForward([1, 1]);
    const result = network.feedForward();
    equal(Math.round(result[0]), 1);
  });
});

describe('Binary Adder', () => {
  let network;

  // Training data for a xor gate
  const trainingData = [
    {
      input: [0, 0],
      output: [0, 0],
    },
    {
      input: [0, 1],
      output: [1, 0],
    },
    {
      input: [1, 0],
      output: [1, 0],
    },
    {
      input: [1, 1],
      output: [0, 1],
    },
  ];

  before(async () => {
    // Create the network
    network = new NeuralNetwork([2, 2, 2]);

    // Set a learning rate
    network.learningRate = 0.3;

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });

  // after(async () => {
  //   console.log(JSON.stringify(network, null, 2));
  // });

  for (const { input, output } of trainingData) {
    test(`should return [${output}] for a [${input}] input`, () => {
      network.feedForward(input);
      const [sum, carry] = network.feedForward();
      equal(Math.round(sum), output[0]);
      equal(Math.round(carry), output[1]);
    });
  }
});
