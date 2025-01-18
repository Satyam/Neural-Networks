import Paper from './paper.mjs';

export default function parse(width, height, lines) {
  if (width * height == 0) {
    throw new Error('ParseError: "width and height cannot be 0" at line 0');
  }
  if (width != lines[0].length || height != lines.length) {
    throw new Error(
      'ParseError: "width and height must match puzzle size" at line 1'
    );
  }

  const table = [];
  for (const line of lines) {
    for (c of line) {
      table.push(c);
    }
  }
  const table1 = lines.join('').split('');

  console.log('Parse lines into table', table == table1);
  return new Paper(width, height, table);
}
