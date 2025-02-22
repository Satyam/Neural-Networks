import { test, describe, before } from 'node:test';
import { equal } from 'node:assert/strict';

import Network from './network.mjs';

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
    network = new Network([2, 10, 10, 1]);

    // Set a learning rate
    const learningRate = 0.3;
    network.setLearningRate(learningRate);

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });

  test('should return 0 for a [0,0] input', () => {
    network.activate([0, 0]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 0);
  });

  test('should return 1 for a [0,1] input', () => {
    network.activate([0, 1]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 1);
  });

  test('should return 1 for a [1,0] input', () => {
    network.activate([1, 0]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 1);
  });

  test('should return 0 for a [1,1] input', () => {
    network.activate([1, 1]);
    const result = network.runInputSigmoid();
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
    network = new Network([2, 10, 10, 1]);

    // Set a learning rate
    const learningRate = 0.3;
    network.setLearningRate(learningRate);

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });

  test('should return 0 for a [0,0] input', () => {
    network.activate([0, 0]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 0);
  });

  test('should return 0 for a [0,1] input', () => {
    network.activate([0, 1]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 0);
  });

  test('should return 0 for a [1,0] input', () => {
    network.activate([1, 0]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 0);
  });

  test('should return 1 for a [1,1] input', () => {
    network.activate([1, 1]);
    const result = network.runInputSigmoid();
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
    network = new Network([2, 10, 10, 1]);

    // Set a learning rate
    const learningRate = 0.3;
    network.setLearningRate(learningRate);

    // Train the network
    for (var i = 0; i < 20000; i++) {
      const trainingItem =
        trainingData[Math.floor(Math.random() * trainingData.length)];
      // Randomly train
      network.train(trainingItem.input, trainingItem.output);
    }
  });

  test('should return 0 for a [0,0] input', () => {
    network.activate([0, 0]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 0);
  });

  test('should return 1 for a [0,1] input', () => {
    network.activate([0, 1]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 1);
  });

  test('should return 1 for a [1,0] input', () => {
    network.activate([1, 0]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 1);
  });

  test('should return 1 for a [1,1] input', () => {
    network.activate([1, 1]);
    const result = network.runInputSigmoid();
    equal(Math.round(result[0]), 1);
  });
});
