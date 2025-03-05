const inicial = {
  net: {
    numLayers: 3,
    sizes: [2, 2, 2],
    net: [
      {
        size: 2,
        biases: [],
        weights: [],
      },
      {
        size: 2,
        biases: [0, 0],
        weights: [
          [0, 0],
          [0, 0],
        ],
      },
      {
        size: 2,
        biases: [0, 0],
        weights: [
          [0, 0],
          [0, 0],
        ],
      },
    ],
  },
};
const a0 = { i: 0, input: [0, 1], sum: 1, carry: 0 };
const net0 = {
  numLayers: 3,
  sizes: [2, 2, 2],
  net: [
    {
      size: 2,
      biases: [],
      weights: [],
    },
    {
      size: 2,
      biases: [0.0625, 0.0625],
      weights: [
        [0, 0.015625],
        [0, 0.015625],
      ],
    },
    {
      size: 2,
      biases: [0.5, -0.5],
      weights: [
        [0.0625, 0.0625],
        [-0.0625, -0.0625],
      ],
    },
  ],
};
const a1 = { i: 1, input: [0, 0], sum: 1, carry: 0 };
const net1 = {
  numLayers: 3,
  sizes: [2, 2, 2],
  net: [
    {
      size: 2,
      biases: [],
      weights: [],
    },
    {
      size: 2,
      biases: [0.13913431438126295, 0.13913431438126295],
      weights: [
        [0, 0.015625],
        [0, 0.015625],
      ],
    },
    {
      size: 2,
      biases: [0.8625178668039865, -0.8625178668039865],
      weights: [
        [0.10569729301466285, 0.10569729301466285],
        [-0.10569729301466285, -0.10569729301466285],
      ],
    },
  ],
};
