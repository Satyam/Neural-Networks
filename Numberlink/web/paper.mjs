const GRASS = '#';
const EMPTY = '.';

const N = 1;
const E = 2;
const S = 4;
const W = 8;

// Array for iterating over simple directions
const DIRS = [N, E, S, W];
// Mirrors simple directions
const MIR = { N: S, E: W, S: N, W: E };
// Filter for N|E, N|W, S|E and S|W
const DIAG = { [N | E]: true, [N | W]: true, [S | E]: true, [S | W]: true };

export default class Paper {
  constructor(width, height, table) {
    // Pad the given table with #, to make boundery checks easier
    const w = width + 2;
    const h = height + 2;
    this.width = w;
    this.height = h;
    this.vctr = [];
    this.crnr = [];

    const endBorder = Array.from({ length: w }, () => GRASS);
    this.table = endBorder;
    for (let y = 0; y < height; y++) {
      this.table.concat([GRASS], table.slice(y * width, (y + 1) * width), [
        GRASS,
      ]);
    }
    this.table.concat(endBorder);
    this.con = [];
    this.source = [];
    this.end = [];
    this.canSE = [];
    this.canSW = [];
    this.next = [];
    this.initTables();
  }
  solve() {
    this._calls = 0;
    return this.chooseConnection(pos);
  }
  chooseConnection(pos) {
    this._calls++;

    // Final
    if (pos === 0) return this.validate();

    const w = this.width;
    if (this.source[pos]) {
      switch (this.con[pos]) {
        // If the source is not yet connection
        case 0:
          // We can't connect E if we have a NE corner
          if ((this.con[pos - w + 1] != S) | W) {
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
        case (N, W):
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
            (this.con[pos - w + 1] != S) | W &&
            (this.con[pos - w - 1] != S) | E
          ) {
            return this.tryConnection(pos, E);
          }
          break;
        // NW
        case N | W:
          // Check if the 'by others implied' turn is actually allowed
          // We don't need to check the source connection here like in N|E
          if (this.con[pos - w - 1] == (N | W) || this.source[pos - w - 1]) {
            return this.chooseConnection(this.next[pos]);
          }
          break;
        // NE or NS
        case N:
          // Check that we are either extending a corner or starting at a non-occupied source
          if (
            (this.con[pos - w + 1] == N) | E ||
            (this.source[pos - w + 1] && this.con[pos - w + 1] & ((N | E) != 0))
          ) {
            if (this.tryConnection(pos, E)) {
              return true;
            }
          }
          // Ensure we don't block of any diagonals
          if (
            (this.con[pos - w + 1] != S) | W &&
            (this.con[pos - w - 1] != S) | E &&
            this.checkImplicitSE(pos)
          ) {
            return this.tryConnection(pos, S);
          }
          break;
      }
    }
    return false;
  }
  // Check that a SW line of corners, starting at pos, will not intersect a SE or NW line
  checkSWLane(pos) {
    for (; !this.source[pos]; pos += this.width - 1) {
      // Con = 0 means we are crossing a SE line, N|W means a NW
      if (this.con[pos] != W) {
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
      !(this.con[pos + 1] == 0) ||
      this.canSE[pos + 1] ||
      this.table[pos + 1] != EMPTY
    );
  }

  tryConnection(pos1, dirs) {
    // Extract the (last) bit which we will process in this call
    const dir = dirs & -dirs;
    const pos2 = pos1 + this.vctr[dir];
    const end1 = this.end[pos1];
    const end2 = this.end[pos2];

    // Cannot connect out of the paper
    if (this.table[pos2] == GRASS) {
      return false;
    }
    // Check different sources aren't connected
    if (
      this.table[end1] != EMPTY &&
      this.table[end2] != EMPTY &&
      this.table[end1] != this.table[end2]
    ) {
      return false;
    }
    // No loops
    if (end1 == pos2 && end2 == pos1) {
      return false;
    }
    // No tight corners (Just an optimization)
    if (this.con[pos1] != 0) {
      const dir2 = this.con[pos1 + this.vctr[this.con[pos1]]];
      const dir3 = this.con[pos1] | dir;
      if (DIAG[dir2] && DIAG[dir3] && dir2 & (dir3 != 0)) {
        return false;
      }
    }

    // Add the connection and a backwards connection from pos2
    const old1 = this.con[pos1];
    const old2 = this.con[pos2];
    this.con[pos1] |= dir;
    this.con[pos2] |= MIR[dir];
    // Change states of ends to connect pos1 and pos2
    const old3 = this.end[end1];
    const old4 = this.end[end2];
    this.end[end1] = end2;
    this.end[end2] = end1;

    // Remove the done bit and recurse if nessecary
    const dir2 = dirs & ~dir;
    let res = false;
    if (dir2 == 0) {
      res = this.chooseConnection(this.next[pos1]);
    } else {
      res = this.tryConnection(pos1, dir2);
    }

    // Recreate the state, but not if a solution was found,
    // since we'll let it bubble all the way to the caller
    if (!res) {
      this.con[pos1] = old1;
      this.con[pos2] = old2;
      this.end[end1] = old3;
      this.end[end2] = old4;
    }

    return res;
  }

  // As it turns out, though our algorithm avoids must self-touching flows, it
  // can be tricked to allow some. Hence we need this validation to filter out
  // the false positives
  validate() {
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
            if (this.con[p] & (dir != 0)) {
              if (cand != old) {
                next = cand;
              }
            } else if (vtable[cand] == alpha) {
              // We aren't connected, but it has our color,
              // this is exactly what we doesn't want.
              return false;
            }
          }
          // We have reached the end
          if (old != p && this.source[p]) {
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

    // Direction vector table
    for (let dir = 0; dir < 16; dir++) {
      if (dir & (N != 0)) {
        this.vctr[dir] += -w;
      }
      if (dir & (E != 0)) {
        this.vctr[dir] += 1;
      }
      if (dir & (S != 0)) {
        this.vctr[dir] += w;
      }
      if (dir & (W != 0)) {
        this.vctr[dir] -= 1;
      }
    }

    // Positions of the four corners inside the grass
    this.crnr[N | W] = w + 1;
    this.crnr[N | E] = 2 * w - 2;
    this.crnr[S | E] = h * w - w - 2;
    this.crnr[S | W] = h * w - 2 * w + 1;

    // Table to easily check if a position is a source
    this.source = Array(w * h);
    for (let pos = 0; pos < w * h; pos++) {
      this.source[pos] = this.table[pos] != EMPTY && this.table[pos] != GRASS;
    }

    // Pivot tables
    this.canSE = Array(w * h);
    this.canSW = Array(w * h);
    for (const pos of this.table) {
      if (this.source[pos]) {
        const d = this.vctr[N | W];
        for (let p = pos + d; this.table[p] == EMPTY; p += d) {
          this.canSE[p] = true;
        }
        d = this.vctr[N | E];
        for (let p = pos + d; this.table[p] == EMPTY; p += d) {
          this.canSW[p] = true;
        }
      }
    }

    // Diagonal 'next' table
    this.next = Array(w * h);
    let last = 0;
    for (const pos of [
      ...xrange(this.crnr[N | W], this.crnr[N | E], 1),
      ...xrange(this.crnr[N | E], this.crnr[S | E] + 1, w),
    ]) {
      while (this.table[pos] != GRASS) {
        this.next[last] = pos;
        last = pos;
        pos = pos + w - 1;
      }
    }

    // 'Where is the other end' table
    this.end = Array(w * h);
    for (let pos = 0; pos < w * h; pos++) {
      this.end[pos] = pos;
    }

    // Connection table
    this.con = Array(w * h);
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
