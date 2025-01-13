const SIGMA = Uint16Array.from(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"$%&\'()*+,-/:;<=>?@[\\]^_`{|}~'
);
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

export function generate(width, height) {
  const table = tile();
  shuffle();
  oddCorner();
  findFlows();
  return print();

  function print() {
    const colorsUsed = flatten();
    if (colorsUsed > SIGMA.length) {
      throw new Error('Error: Not enough printable characters to print puzzle');
    }
    const pzzl = Array(height).fill('');
    const sltn = Array(height).fill('');
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        sltn[y] += SIGMA[table[y][x]];
        if (isFlowHead(x, y)) {
          pzzl[y] += SIGMA[table[y][x]];
        } else {
          pzzl[y] += '.';
        }
      }
    }
    return [pzzl, sltn];
  }
  function tile() {
    const table = [];
    for (let y = 0; y < height; y++) {
      table[y] = new Uint8Array(width);
    }
    let alpha = 0;
    for (let y = 0; y < height - 1; y += 2) {
      for (let x = 0; x < width; x++) {
        table[y][x] = alpha;
        table[y + 1][x] = alpha;
        alpha += 1;
      }
    }
    // Add padding in case of odd height
    if (height % 2 == 1) {
      for (let x = 0; x < width - 1; x += 2) {
        table[height - 1][x] = alpha;
        table[height - 1][x + 1] = alpha;
        alpha += 1;
      }
    }
    // In case of odd width, add a single in the corner.
    // We will merge it into a real flow after shuffeling
    if (width % 2 == 1) {
      table[height - 1][width - 1] = alpha;
    }
    return table;
  }

  function shuffle() {
    const sizeSquared = width * height * width * height;
    for (let i = 0; i < sizeSquared; i++) {
      const x = intn(width - 1);
      const y = intn(height - 1);
      if (
        table[y][x] == table[y][x + 1] &&
        table[y + 1][x] == table[y + 1][x + 1]
      ) {
        // Horizontal case
        // aa \ ab
        // bb / ab
        table[y + 1][x] = table[y][x];
        table[y][x + 1] = table[y + 1][x + 1];
      } else if (
        table[y][x] == table[y + 1][x] &&
        table[y][x + 1] == table[y + 1][x + 1]
      ) {
        // Vertical case
        // ab \ aa
        // ab / bb
        table[y][x + 1] = table[y][x];
        table[y + 1][x] = table[y + 1][x + 1];
      }
    }
  }

  function oddCorner() {
    if (width % 2 == 1 && height % 2 == 1) {
      // Horizontal case:
      // aax
      if (
        width > 2 &&
        table[height - 1][width - 3] == table[height - 1][width - 2]
      ) {
        table[height - 1][width - 1] = table[height - 1][width - 2];
      }
      // Vertical case:
      // ab
      // ax
      if (
        height > 2 &&
        table[height - 3][width - 1] == table[height - 2][width - 1]
      ) {
        table[height - 1][width - 1] = table[height - 2][width - 1];
      }
    }
  }

  function findFlows() {
    perm(width * height).forEach((p) => {
      let x = p % width;
      let y = Math.floor(p / width);
      if (isFlowHead(x, y)) {
        layFlow(x, y);
      }
    });
  }

  function isFlowHead(x, y) {
    let degree = 0;
    for (let i = 0; i < 4; i++) {
      const x1 = x + DX[i];
      const y1 = y + DY[i];
      if (inside(x1, y1, width, height) && table[y1][x1] === table[y][x]) {
        degree += 1;
      }
    }
    return degree < 2;
  }

  function layFlow(x, y) {
    perm(4).forEach((i) => {
      const x1 = x + DX[i];
      const y1 = y + DY[i];
      if (inside(x1, y1, width, height) && canConnect(x, y, x1, y1)) {
        fill(x1, y1, table[y][x]);
        const [x2, y2] = follow(x1, y1, x, y);
        layFlow(x2, y2);
        return;
      }
    });
  }

  function canConnect(x1, y1, x2, y2) {
    if (table[y1][x1] === table[y2][x2]) return false;
    if (!isFlowHead(x1, y1) || !isFlowHead(x2, y2)) return false;
    for (let y3 = 0; y3 < height; y3++) {
      for (let x3 = 0; x3 < width; x3++) {
        for (let i = 0; i < 4; i++) {
          const x4 = x3 + DX[i];
          const y4 = y3 + DY[i];
          if (
            inside(x4, y4, width, height) &&
            table[y3][x3] === table[y1][x1] &&
            table[y4][x4] === table[y2][x2]
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function fill(x, y, alpha) {
    const orig = table[y][x];
    table[y][x] = alpha;
    for (let i = 0; i < 4; i++) {
      const x1 = x + DX[i];
      const y1 = y + DY[i];
      if (inside(x1, y1, width, height) && table[y1][x1] === orig) {
        fill(x1, y1, alpha);
      }
    }
  }

  function follow(x, y, x0, y0) {
    for (let i = 0; i < 4; i++) {
      const x1 = x + DX[i];
      const y1 = y + DY[i];
      if (
        inside(x1, y1, width, height) &&
        !(x1 === x0 && y1 === y0) &&
        table[y][x] === table[y1][x1]
      ) {
        return follow(x1, y1, x, y);
      }
    }
    return [x, y];
  }

  function flatten() {
    let alpha = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (table[y[x] >= 0]) {
          fill(x, y, alpha);
          alpha -= 1;
        }
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        table[y][x] = -table[y][x] - 1;
      }
    }
    return -alpha - 1;
  }
}

function perm(n) {
  const m = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < n; i++) {
    const j = intn(i + 1);
    m[i] = m[j];
    m[j] = i;
  }
  return m;
}

function intn(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function inside(x, y, width, height) {
  return 0 <= x && x < width && 0 <= y && y < height;
}
