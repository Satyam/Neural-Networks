import { NeuralNetwork } from './neuralNetwork.js';

const net = new NeuralNetwork(2, 2, 2);
net.loadNet({
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
});
// given a and b, return an array with [sum, carry]
const adder = (a, b) => (a ? (b ? [0, 1] : [1, 0]) : b ? [1, 0] : [0, 0]);

const bit = () => (Math.random() < 0.5 ? 0 : 1);

console.log(`const inicial = { net: ${JSON.stringify(net, null, 2)}}`);

for (let i = 0; i < 2; i++) {
  const a = bit();
  const b = bit();
  const [sum, carry] = adder(a, b);
  console.log(
    `const a${i} = {i: ${i} , input: [${a}, ${b}], sum: ${sum}, carry: ${carry}}`
  );
  net.train([a, b], [sum, carry], 1);
  console.log(`const net${i} = ${JSON.stringify(net, null, 2)}`);
}

// console.log(JSON.stringify(new NeuralNetwork(2, 2, 2), null, 2));

// const sampleNet = {
//   numLayers: 3,
//   sizes: [2, 3, 4],
//   net: [
//     {
//       size: 2,
//       biases: [],
//       weights: [],
//     },
//     {
//       size: 3,
//       biases: [-0.7598880973837971, 0.552657190888219, -0.5620920955708777],
//       weights: [
//         [0.5929303665961703, 0.7233109916467724],
//         [0.5549032245445757, 0.5810305641984659],
//         [-0.05725229722215719, 0.0043838494284256235],
//       ],
//     },
//     {
//       size: 4,
//       biases: [
//         -0.03780018999004087, -0.1782365864744757, -0.24640287230792746,
//         0.8677057980482163,
//       ],
//       weights: [
//         [0.8801039455078743, -0.10244192431531429, 0.48381167618884113],
//         [0.8073060888384211, -0.4462179873581045, 0.8678160446118315],
//         [-0.7875064138628858, 0.8333068178611116, -0.009287223842354031],
//         [0.12956738933100098, -0.37122637207415643, 0.7462857062060828],
//       ],
//     },
//   ],
// };
// const net = new NeuralNetwork(2, 3, 4);
// net.loadNet(sampleNet);

// console.log(JSON.stringify(net) == JSON.stringify(sampleNet));
