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
}
