import util from 'node:util';

const GRASS = '#';
export const EMPTY = '.';

const N = 1;
const E = 2;
const S = 4;
const W = 8;

// Array for iterating over simple directions
export const DIRS = [N, E, S, W];
// Mirrors simple directions
const MIR = { [N]: S, [E]: W, [S]: N, [W]: E };
// Filter for N|E, N|W, S|E and S|W
const DIAG = { [N | E]: true, [N | W]: true, [S | E]: true, [S | W]: true };

export default class Paper {
  constructor(width, height, table) {
    // Pad the given table with #, to make boundery checks easier
    const w = width + 2;
    const h = height + 2;
    this.width = w;
    this.height = h;
    this.vctr = Array(16).fill(0);
    this.crnr = Array(16).fill(0);

    const endBorder = Array(w).fill(GRASS);
    this.table = endBorder.concat();
    // We are usung the original width and height here,
    // without extra GRASS,
    // because that is the size of the original`table`
    for (let y = 0; y < height; y++) {
      this.table = this.table.concat(
        GRASS,
        table.slice(y * width, (y + 1) * width),
        GRASS
      );
    }
    this.table = this.table.concat(endBorder);

    this.con = [];
    this.source = [];
    this.end = [];
    this.canSE = [];
    this.canSW = [];
    this.next = [];
    this.initTables();
  }

  solve() {
    this.calls = 0;
    return this.chooseConnection(this.crnr[N | W]);
  }
  chooseConnection(pos) {
    this.calls++;
    console.log('chooseConnection', pos);
    for (const callSite of util.getCallSites()) {
      if (callSite.functionName === 'solve') break;
      console.log('---', callSite.functionName);
    }
    // Final
    if (pos === 0) return this.validate();

    const w = this.width;
    if (this.source[pos]) {
      switch (this.con[pos]) {
        // If the source is not yet connection
        case 0:
          // We can't connect E if we have a NE corner
          if (this.con[pos - w + 1] !== (S | W)) {
            if (this.tryConnection(pos, E)) {
              return true;
            }
          }
          // South connections can create a forced SE position
          if (this.checkImplicitSE(pos)) {
            if (this.tryConnection(pos, S)) {
              return true;
            }
          }
          break;
        // If the source is already connected
        case N:
        case W:
          return this.chooseConnection(this.next[pos]);
      }
    } else {
      switch (this.con[pos]) {
        // SE
        case 0:
          // Should we check for implied N|W?
          if (this.canSE[pos]) {
            return this.tryConnection(pos, E | S);
          }
          break;
        // SW or WE
        case W:
          // Check there is a free line down to the source we are turning around
          if (
            this.canSW[pos] &&
            this.checkSWLane(pos) &&
            this.checkImplicitSE(pos)
          ) {
            if (this.tryConnection(pos, S)) {
              return true;
            }
          }
          // Ensure we don't block of any diagonals (NE and NW don't seem very important)
          if (
            this.con[pos - w + 1] !== (S | W) &&
            this.con[pos - w - 1] !== (S | E)
          ) {
            return this.tryConnection(pos, E);
          }
          break;
        // NW
        case N:
        case W:
          // Check if the 'by others implied' turn is actually allowed
          // We don't need to check the source connection here like in N|E
          if (this.con[pos - w - 1] === (N | W) || this.source[pos - w - 1]) {
            return this.chooseConnection(this.next[pos]);
          }
          break;
        // NE or NS
        case N:
          // Check that we are either extending a corner or starting at a non-occupied source
          if (
            this.con[pos - w + 1] === (N | E) ||
            (this.source[pos - w + 1] &&
              (this.con[pos - w + 1] & (N | E)) !== 0)
          ) {
            if (this.tryConnection(pos, E)) {
              return true;
            }
          }
          // Ensure we don't block of any diagonals
          if (
            this.con[pos - w + 1] !== (S | W) &&
            this.con[pos - w - 1] !== (S | E) &&
            this.checkImplicitSE(pos)
          ) {
            return this.tryConnection(pos, S);
          }
          break;
      }
    }
    console.log('chooseConnection returns false');
    return false;
  }
  // Check that a SW line of corners, starting at pos, will not intersect a SE or NW line
  checkSWLane(pos) {
    for (; !this.source[pos]; pos += this.width - 1) {
      // Con = 0 means we are crossing a SE line, N|W means a NW
      if (this.con[pos] !== W) {
        return false;
      }
    }
    return true;
  }
  // Check that a south connection at pos won't create a forced, illegal SE corner at pos+1
  // Somethine like: │└
  //                 │   <-- Forced SE corner
  checkImplicitSE(pos) {
    return (
      !(this.con[pos + 1] === 0) ||
      this.canSE[pos + 1] ||
      this.table[pos + 1] !== EMPTY
    );
  }

  tryConnection(srcPos, dirs) {
    // Extract the (last) bit which we will process in this call
    console.log('tryConnection', srcPos, dirs, dirs & -dirs);
    for (const callSite of util.getCallSites()) {
      if (callSite.functionName === 'solve') break;
      console.log('---', callSite.functionName);
    }
    this._conend('inicio');
    const dir = dirs & -dirs;

    const nextPos = srcPos + this.vctr[dir];
    const srcEnd = this.end[srcPos];
    const nextEnd = this.end[nextPos];

    // Cannot connect out of the paper
    if (this.table[nextPos] === GRASS) {
      return false;
    }
    // Check different sources aren't connected
    if (
      this.table[srcEnd] !== EMPTY &&
      this.table[nextEnd] !== EMPTY &&
      this.table[srcEnd] !== this.table[nextEnd]
    ) {
      return false;
    }
    // No loops
    if (srcEnd === nextPos && nextEnd === srcPos) {
      return false;
    }
    // No tight corners (Just an optimization)
    if (this.con[srcPos] !== 0) {
      const dir2 = this.con[srcPos + this.vctr[this.con[srcPos]]];
      const dir3 = this.con[srcPos] | dir;
      if (DIAG[dir2] && DIAG[dir3] && (dir2 & dir3) !== 0) {
        return false;
      }
    }

    // Add the connection and a backwards connection from nextPos
    const oldSrcCon = this.con[srcPos];
    const oldNextCon = this.con[nextPos];
    this.con[srcPos] |= dir;
    this.con[nextPos] |= MIR[dir];
    // Change states of ends to connect srcPos and nextPos
    const oldSrcEnd = this.end[srcEnd];
    const oldNextEnd = this.end[nextEnd];
    this.end[srcEnd] = nextEnd;
    this.end[nextEnd] = srcEnd;

    this._conend('before recurse');
    // Remove the done bit and recurse if nessecary
    const dir2 = dirs & ~dir;
    let res = false;
    if (dir2 === 0) {
      res = this.chooseConnection(this.next[srcPos]);
    } else {
      res = this.tryConnection(srcPos, dir2);
    }

    // Recreate the state, but not if a solution was found,
    // since we'll let it bubble all the way to the caller
    if (!res) {
      this.con[srcPos] = oldSrcCon;
      this.con[nextPos] = oldNextCon;
      this.end[srcEnd] = oldSrcEnd;
      this.end[nextEnd] = oldNextEnd;
    }
    this._conend(`tryConnection(${srcPos},${dirs}) returns with ${res}`);
    return res;
  }

  _conend(msg) {
    console.log(msg);
    const fmt = (what, start, end) =>
      what
        .slice(start, end)
        .map((v) => String(v).padStart(2, ' '))
        .join(' ');
    for (let y = 1; y < this.height - 1; y++) {
      const start = y * this.width + 1;
      const end = start + this.width - 2;
      console.log(
        'c:',
        fmt(this.con, start, end),
        '  e:',
        fmt(this.end, start, end),
        '  t:',
        this.table.slice(start, end).join('')
      );
    }
  }
  // As it turns out, though our algorithm avoids must self-touching flows, it
  // can be tricked to allow some. Hence we need this validation to filter out
  // the false positives
  validate() {
    console.log('validate');
    const w = this.width;
    const h = this.height;
    const vtable = Array(w * h);
    for (let pos = 0; pos < w * h; pos++) {
      if (this.source[pos]) {
        // Run throw the flow
        const alpha = this.table[pos];
        let p = pos;
        let old = pos;
        let next = pos;
        for (;;) {
          // Mark our path as we go
          vtable[p] = alpha;
          for (const dir of DIRS) {
            const cand = p + this.vctr[dir];
            if ((this.con[p] & dir) !== 0) {
              if (cand !== old) {
                next = cand;
              }
            } else if (vtable[cand] === alpha) {
              // We aren't connected, but it has our color,
              // this is exactly what we doesn't want.
              return false;
            }
          }
          // We have reached the end
          if (old !== p && this.source[p]) {
            break;
          }
          old = p;
          p = next;
        }
      }
    }
    return true;
  }

  initTables() {
    const w = this.width;
    const h = this.height;
    const size = w * h;

    // Direction vector table
    for (let dir = 0; dir < 16; dir++) {
      if ((dir & N) !== 0) {
        this.vctr[dir] += -w;
      }
      if ((dir & E) !== 0) {
        this.vctr[dir] += 1;
      }
      if ((dir & S) !== 0) {
        this.vctr[dir] += w;
      }
      if ((dir & W) !== 0) {
        this.vctr[dir] -= 1;
      }
    }

    // Positions of the four corners inside the grass
    this.crnr[N | W] = w + 1;
    this.crnr[N | E] = 2 * w - 2;
    this.crnr[S | E] = size - w - 2;
    this.crnr[S | W] = size - 2 * w + 1;

    // Table to easily check if a position is a source
    this.source = Array.from(
      { length: size },
      (_, pos) => this.table[pos] !== EMPTY && this.table[pos] !== GRASS
    );

    // Pivot tables
    this.canSE = Array(size).fill(false);
    this.canSW = Array(size).fill(false);
    for (let pos = 0; pos < size; pos++) {
      if (this.source[pos]) {
        let d = this.vctr[N | W];
        for (let p = pos + d; this.table[p] === EMPTY; p += d) {
          this.canSE[p] = true;
        }
        d = this.vctr[N | E];
        for (let p = pos + d; this.table[p] === EMPTY; p += d) {
          this.canSW[p] = true;
        }
      }
    }

    // Diagonal 'next' table
    this.next = Array(size).fill(0);
    let last = 0;
    for (let pos of [
      ...this.xrange(this.crnr[N | W], this.crnr[N | E], 1),
      ...this.xrange(this.crnr[N | E], this.crnr[S | E] + 1, w),
    ]) {
      while (this.table[pos] !== GRASS) {
        this.next[last] = pos;
        last = pos;
        pos = pos + w - 1;
      }
    }

    // 'Where is the other end' table
    this.end = Array.from({ length: size }, (_, pos) => pos);

    // Connection table
    this.con = Array(w * h).fill(0);
  }

  // Makes a slice of the interval [i, i+step, i+2step, ..., j)
  xrange(i, j, step) {
    const slice = [];
    while (i < j) {
      slice.push(i);
      i += step;
    }
    return slice;
  }
}
