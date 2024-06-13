#!/usr/bin/env zx

const sections = ['[begin]', '[problem]', '[solution]', '[moves]', '[end]'];
const files = await glob('janko/a*.txt');
for (const file of files) {
  const game = await fs.readFile(file, 'utf8');
  let state = 0;
  const data = { problem: [], solution: [] };
  let moves = '';
  for (const l of game.split('\n')) {
    const line = l.trim();
    if (line.length) {
      const newState = sections.indexOf(line) + 1;
      if (newState) {
        state = newState;
      } else {
        switch (state) {
          case 1: {
            const p = line.split(' ');
            data[p[0]] = p[1];
            break;
          }
          case 2: {
            data.problem.push(
              line.split(' ').map((v) => (v === '-' ? 0 : parseInt(v, 10)))
            );
            break;
          }
          case 3: {
            data.solution.push(line.split(' '));
            break;
          }
          case 4:
            moves = moves.concat(line);
            break;
          case 5:
            break;
          default:
            console.error(file, state, line);
        }
      }
    }
  }
  data.moves = moves.split(';');
  let rows, cols;
  if (data.size) {
    if (data.rows || data.cols) {
      console.error(file, 'size and (rows or cols)');
    }
    rows = parseInt(data.size, 10);
    cols = parseInt(data.size, 10);
  } else {
    rows = parseInt(data.rows, 10);
    cols = parseInt(data.cols, 10);
  }
  if (
    !(
      data.solution.length === rows &&
      data.solution.every((row) => row.length === cols)
    )
  ) {
    console.error(file, 'solution size does not match');
  }
  if (
    !(
      data.problem.length === rows &&
      data.problem.every((row) => row.length === cols)
    )
  ) {
    console.error(file, 'problem size does not match');
  }
  await fs.writeJson(file.replace('.txt', '.json'), data);
}
