const GRASS = '#';
export const EMPTY = '.';

const N = 1;
const E = 2;
const S = 4;
const W = 8;
const NE = N | E;
const NW = N | W;
const SE = S | E;
const SW = S | W;

// Array for iterating over simple directions
export const DIRS = [N, E, S, W];
// Mirrors simple directions
const MIR = { [N]: S, [E]: W, [S]: N, [W]: E };
// Filter for N|E, N|W, S|E and S|W
const DIAG = { [NE]: true, [NW]: true, [SE]: true, [SW]: true };

export default class Paper {
  constructor(width, height, table) {
    // Pad the given table with #, to make boundery checks easier
    const w = width + 2;
    const h = height + 2;
    this.width = w;
    this.height = h;

    this.vctr = new Int16Array(16).fill(0);
    this.crnr = new Uint16Array(16).fill(0);

    const endBorder = Array(w).fill(GRASS);
    this.table = endBorder.concat();
    // We are using the original width and height here,
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

    // This will all be initialized in initTable
    // so they are not needed here
    // All boleans are Uint8Arrays,
    // All cell references are Uint16Arrays
    // which allow for sizes up to 256*256

    // this.con = new Uint16Array(w * h);
    // this.source = new Uint8Array(w * h);
    // this.end = new Uint16Array(w * h);
    // this.canSE = new Uint8Array(w * h);
    // this.canSW = new Uint8Array(w * h);
    // this.next = new Uint16Array(w * h);
    this.initTables();
  }

  solve() {
    this.calls = 0;
    return this.chooseConnection(this.crnr[NW]);
  }
  chooseConnection(pos) {
    this.calls++;

    // Final
    if (pos === 0) return this.validate();

    const posNE = pos + this.vctr[NE];
    const posNW = pos + this.vctr[NW];
    if (this.source[pos]) {
      switch (this.con[pos]) {
        // If the source is not yet connected
        case 0:
          // We can't connect E if we have a NE corner
          if (this.con[posNE] !== SW) {
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
          if (this.con[posNE] !== SW && this.con[posNW] !== SE) {
            return this.tryConnection(pos, E);
          }
          break;
        // NW
        case NW:
          // Check if the 'by others implied' turn is actually allowed
          // We don't need to check the source connection here like in N|E
          if (this.con[posNW] === NW || this.source[posNW]) {
            return this.chooseConnection(this.next[pos]);
          }
          break;
        // NE or NS
        case N:
          // Check that we are either extending a corner or starting at a non-occupied source
          if (
            this.con[posNE] === NE ||
            (this.source[posNE] && this.con[posNE] & NE)
          ) {
            if (this.tryConnection(pos, E)) {
              return true;
            }
          }
          // Ensure we don't block of any diagonals
          if (
            this.con[posNE] !== SW &&
            this.con[posNW] !== SE &&
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
    if (this.con[srcPos]) {
      const dir2 = this.con[srcPos + this.vctr[this.con[srcPos]]];
      const dir3 = this.con[srcPos] | dir;
      if (DIAG[dir2] && DIAG[dir3] && dir2 & dir3) {
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

    // Remove the done bit and recurse if necessary
    const dir2 = dirs & ~dir;
    const res = dir2
      ? this.tryConnection(srcPos, dir2)
      : this.chooseConnection(this.next[srcPos]);

    // Recreate the state, but not if a solution was found,
    // since we'll let it bubble all the way to the caller
    if (!res) {
      this.con[srcPos] = oldSrcCon;
      this.con[nextPos] = oldNextCon;
      this.end[srcEnd] = oldSrcEnd;
      this.end[nextEnd] = oldNextEnd;
    }
    return res;
  }

  // As it turns out, though our algorithm avoids most self-touching flows, it
  // can be tricked to allow some. Hence we need this validation to filter out
  // the false positives
  validate() {
    const w = this.width;
    const h = this.height;
    const vtable = Array(w * h);
    for (let pos = 0; pos < w * h; pos++) {
      if (this.source[pos]) {
        // Run through the flow
        const alpha = this.table[pos];
        let p = pos;
        let old = pos;
        let next = pos;
        for (;;) {
          // Mark our path as we go
          vtable[p] = alpha;
          for (const dir of DIRS) {
            const cand = p + this.vctr[dir];
            if (this.con[p] & dir) {
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
      if (dir & N) {
        this.vctr[dir] += -w;
      }
      if (dir & E) {
        this.vctr[dir] += 1;
      }
      if (dir & S) {
        this.vctr[dir] += w;
      }
      if (dir & W) {
        this.vctr[dir] -= 1;
      }
    }

    // Positions of the four corners inside the grass
    this.crnr[NW] = w + 1;
    this.crnr[NE] = 2 * w - 2;
    this.crnr[SE] = size - w - 2;
    this.crnr[SW] = size - 2 * w + 1;

    // Table to easily check if a position is a source
    this.source = Uint8Array.from(
      { length: size },
      (_, pos) => this.table[pos] !== EMPTY && this.table[pos] !== GRASS
    );

    // Pivot tables
    this.canSE = new Uint8Array(size).fill(false);
    this.canSW = new Uint8Array(size).fill(false);
    for (let pos = 0; pos < size; pos++) {
      if (this.source[pos]) {
        let d = this.vctr[NW];
        for (let p = pos + d; this.table[p] === EMPTY; p += d) {
          this.canSE[p] = true;
        }
        d = this.vctr[NE];
        for (let p = pos + d; this.table[p] === EMPTY; p += d) {
          this.canSW[p] = true;
        }
      }
    }

    // Diagonal 'next' table
    this.next = new Uint16Array(size).fill(0);
    let last = 0;
    for (let pos of [
      ...this.xrange(this.crnr[NW], this.crnr[NE], 1),
      ...this.xrange(this.crnr[NE], this.crnr[SE] + 1, w),
    ]) {
      while (this.table[pos] !== GRASS) {
        this.next[last] = pos;
        last = pos;
        pos = pos + w - 1;
      }
    }

    // 'Where is the other end' table
    this.end = Uint16Array.from({ length: size }, (_, pos) => pos);

    // Connection table
    this.con = new Uint16Array(size).fill(0);
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
