const isNumber = (n) => {
  return typeof m === 'number' && Number.isFinite(m);
};

class Matrix {
  #matrix = null;
  #rows = 0;
  #cols = 0;
  constructor(rows, cols) {
    if (rows instanceof Matrix) {
      this.#matrix = Array.from(rows.matrix);
      this.#rows = rows.rows;
      this.#cols = rows.cols;
      return;
    }
    if (
      Array.isArray(rows) &&
      rows.every((row) => Array.isArray(row) && row.length === rows[0].length)
    ) {
      this.#matrix = Array.from(rows);
      this.#rows = rows.length;
      this.#cols = rows[0].length;
      return;
    }
    if (type) this.#rows = rows;
    this.#cols = cols;
    this.#matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));
  }
  get rows() {
    return this.#rows;
  }
  get cols() {
    return this.#cols;
  }
  forEach(fn) {
    for (let r = 0; r < this.#rows; r++) {
      for (let c = 0; c < this.#cols; c++) {
        const val = this.#matrix[r][c];
        this.#matrix[r][c] = fn(val, r, c) ?? val;
      }
    }
    return this;
  }
  randomize(min = 0, max = 1, integer = false) {
    if (typeof max === 'undefined') {
      max = min;
      min = 0;
    }
    return this.forEach(() => {
      const val = Math.random() * (max - min) + min;
      return integer ? Math.round(val) : val;
    });
  }
  get matrix() {
    return this.#matrix;
  }
  get(row, col) {
    return this.#matrix[row][col];
  }
  set(row, col, val) {
    this.#matrix[row][col] = val;
    return this;
  }
  getRow(row) {
    return this.#matrix[row];
  }
  getCol(col) {
    return this.#matrix.map((row) => row[col]);
  }
  times(m) {
    if (m instanceof Matrix) {
      if (this.#cols === m.rows) {
        return new Matrix(this.#rows, m.cols).forEach((_, row, col) => {
          let val = 0;
          for (let n = 0; n < this.#cols; n++) {
            val += this.#matrix[row][n] * m.get(n, col);
          }
          return val;
        });
      }
      throw Error(
        `Matrix of ${this.cols} columns cannot be multiplied with Matrix of ${m.rows} rows`
      );
    }
    if (m instanceof Vector) {
      if (this.#cols === m.numItems) {
        return new Vector(this.#rows).forEach((_, row) => {
          let val = 0;
          for (let n = 0; n < this.#cols; n++) {
            val += this.#matrix[row][n] * m.get(n);
          }
          return val;
        });
      }
      throw Error(
        `Matrix of ${this.columns} cannot be multiplied with Vector of ${m.numItems} elements`
      );
    }
    if (isNumber(m)) {
      return new Matrix(this).forEach((v) => v * m);
    }
    throw new Error(`Can't multiply Matrix with ${m} of type ${typeof m}`);
  }
  add(m) {
    if (m instanceof Matrix) {
      if (this.#cols === m.cols && this.#rows === m.rows) {
        return new Matrix(this.#rows, this.#cols).forEach((_, row, col) => {
          return this.#matrix[row][col] + m.get(row, col);
        });
      }
      throw Error(
        `Matrices are of different size: 
        self: [${this.#rows},${this.#cols}] with [${m.rows},${m.cols}]`
      );
    }
    if (isNumber(m)) {
      return new Matrix(this).forEach((v) => v + m);
    }
    throw new Error(`Can't add Matrix with ${m} of type ${typeof m}`);
  }
  toString() {
    return `-- Matrix --
rows: ${this.#rows}, cols: ${this.#cols}
${this.#matrix.map((row) => row.join(', ')).join('\n')}`;
  }
}

class Vector {
  #vector;
  #numItems;
  constructor(numItems) {
    if (numItems instanceof Vector) {
      this.#vector = Array.from(numItems.vector);
      this.#numItems = numItems.numItems;
      return;
    }
    if (Array.isArray(numItems)) {
      this.#vector = Array;
    }
    this.#numItems = numItems;
    this.#vector = new Array(numItems).fill(0);
  }
  get numItems() {
    return this.#numItems;
  }
  forEach(fn) {
    for (let i = 0; i < this.#numItems; i++) {
      const val = this.#vector[i];
      this.#vector[i] = fn(val, i) ?? val;
    }
    return this;
  }
  randomize(min = 0, max = 1, integer = false) {
    if (typeof max === 'undefined') {
      max = min;
      min = 0;
    }
    return this.forEach(() => {
      const val = Math.random() * (max - min) + min;
      return integer ? Math.round(val) : val;
    });
  }
  get vector() {
    return this.#vector;
  }
  get(item) {
    return this.#vector[item];
  }
  set(item, val) {
    this.#vector[item] = val;
    return this;
  }
  times(m) {
    if (m instanceof Matrix) {
      if (this.#numItems === m.cols) {
        return new Vector(m.rows).forEach((_, row) => {
          let val = 0;
          for (let n = 0; n < this.#numItems; n++) {
            val += this.#vector[n] * m.get(row, n);
          }
          return val;
        });
      }
      throw Error(
        `Vector of ${
          this.#numItems
        } items cannot be multiplied with Matrix of ${m.cols} columns`
      );
    }
    if (m instanceof Vector && m.numItems === this.#numItems) {
      return this.#vector.reduce((out, val, i) => out + val * m.get(i), 0);
    }
    if (isNumber(m)) {
      return new Vector(this).forEach((v) => v * m);
    }
    throw new Error(`Can't multiply Vector with ${m} of type ${typeof m}`);
  }
  toString() {
    return `-- Vector --
Number of items ${this.#numItems}
${this.#vector.join(', ')}`;
  }
}

// test

// console.log('new Matrix(3,4)', new Matrix(3, 4).toString());
const A = new Matrix([
  [1, 0, 1],
  [2, 1, 1],
  [0, 1, 1],
  [1, 1, 2],
]);
const B = new Matrix([
  [1, 2, 1],
  [2, 3, 1],
  [4, 2, 2],
]);
console.log('A', A.toString());
console.log('B', B.toString());
console.log('A * B', A.times(B).toString());
console.log('A * 2', A.times(2).toString());
// console.log('random -1,1', new Matrix(3, 4).randomize(-1, 1).toString());
// console.log('random 10', new Matrix(2, 2).randomize(10).toString());
// console.log(
//   'random 0,10,true',
//   new Matrix(2, 2).randomize(0, 10, true).toString()
// );
// console.log(
//   'random 0,10,true',
//   new Matrix(2, 2).randomize(0, 1, true).toString()
// );
