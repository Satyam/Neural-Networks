import { DIRS, EMPTY } from './paper.mjs';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const COLORS = {
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
};
const TUBE = [
  ' ',
  '╵',
  '╶',
  '└',
  '╷',
  '│',
  '┌',
  '├',
  '╴',
  '┘',
  '─',
  '┴',
  '┐',
  '┤',
  '┬',
  '┼',
];

// Print the paper by filling each flow with a character in [a-zA-Z0-9]
// If color is true, each flow will be colored by one of 16 terminal color
// codes
export function printSimple(paper, color) {
  const colors = makeColorTable(paper, !color);
  const table = fillTable(paper);
  console.log(paper.width - 2, paper.height - 2);
  for (let y = 1; y < paper.height - 1; y++) {
    let line = '';
    for (let x = 1; x < paper.width - 1; x++) {
      const pos = y * paper.width + x;
      const col = colors[pos] ?? false;
      line += col ? `${col}${table[pos]}${RESET}` : table[pos];
    }
    console.log(line);
  }
}

// Print the paper using unicode table characters such as └ and │
// If color is true, each flow will be colored by one of 16 terminal color
// codes
export function printTubes(paper, color) {
  const colors = makeColorTable(paper, !color);
  for (let y = 1; y < paper.height - 1; y++) {
    let line = '';
    for (let x = 1; x < paper.width - 1; x++) {
      const pos = y * paper.width + x;
      const val = paper.table[pos];
      const c = val === EMPTY ? TUBE[paper.con[pos]] : val;
      const col = colors[pos] ?? false;
      line += col ? `${col}${c}${RESET}` : c;
    }
    console.log(line);
  }
}

// Assigns a terminal color code to every position on the paper
// If empty is true, the table will be a dummy with all empty strings
function makeColorTable(paper, empty) {
  const color = Array(paper.width * paper.height);
  if (!empty) {
    const table = fillTable(paper);

    let next = 0;
    const clrs = Object.values(COLORS);
    const available = clrs + clrs.map((c) => BOLD + c);
    const mapping = {};

    for (let y = 1; y < paper.height - 1; y++) {
      for (let x = 1; x < paper.width - 1; x++) {
        const c = table[y * paper.width + x];
        if (!mapping[c]) {
          if (available.length >= 1) {
            mapping[c] = available[next];
            next = (next + 1) % available.length;
          } else {
            mapping[c] = BLACK;
          }
        }
        color[y * paper.width + x] = mapping[c];
      }
    }
  }
  return color;
}

// Does a bfs search on every source, filling out its connected nodes
// This is neccesary since we normally store only relative connection
// information
function fillTable(paper) {
  const w = paper.width;
  const h = paper.height;
  const table = [...paper.table];
  for (let pos = 0; pos < w * h; pos++) {
    if (paper.source[pos]) {
      const queue = [];
      queue.push(pos);
      while (queue.length) {
        pos = queue.shift();
        const paint = table[pos];
        for (const dir of DIRS) {
          const next = pos + paper.vctr[dir];
          if ((paper.con[pos] & dir) !== 0 && table[next] === EMPTY) {
            table[next] = paint;
            queue.push(next);
          }
        }
      }
    }
  }
  return table;
}
