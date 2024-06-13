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
  await fs.writeJson(file.replace('.txt', '.json'), data);
}
