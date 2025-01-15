import { parseArgs } from 'node:util';
import { generate } from './gen.mjs';

const options = {
  colors: {
    type: 'boolean',
    short: 'c',
    default: false,
  },
  tubes: {
    type: 'boolean',
    short: 't',
    default: false,
  },
  generate: {
    type: 'string',
    short: 'g',
  },
  help: {
    type: 'boolean',
    short: 'h',
  },
};
const { values } = parseArgs({ options });

if (values.help) {
  console.log(`Usage:
    ./numberlink.js [flags]
  where flags:
    --colors, -c: Make the output more readable with colors
    --tubes, -t: Draw lines between sources
    --generate, -t <wxh>: Generate a puzzle of a certain size.
    
    If the --generate flag is not provided, it will expect 
    a numberlink puzzle in standard format as the input.
  
  Examples:
    ./numberlink.js --generate=10x10
      Displays a 10 by 10 cells Numberlink puzzle in standard format

    ./numberlink.js --generate=10x10 >nl10.pzl
      Writes a Numberlink puzzle into the file nl10.pzl

    ./numberlink.js -c -t <nl10.pzl
      Displays the solution of the previously saved puzzle with colored lines.

  Standard Puzzle Format
    Consists of a first line with two numbers representing the width and height of the puzzle
    followed by as many lines as indicated by the height given, 
    each line consisting of matching pairs of characters representing the end-points
    of the links and dots for the blank spaces:

    Example:
      5 5 
      ..0.1
      0.2.3
      2.4.3
      4...1
      5...5
    
    `);
  process.exit(0);
}
console.log(values);
