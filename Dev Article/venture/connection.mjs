class Connection {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.weight = 0.5; // Math.random();
    this.change = 0;
  }

  toJSON() {
    return {
      change: this.change,
      weight: this.weight,
      from: this.from.id,
      to: this.to.id,
    };
  }

  setWeight(w) {
    this.weight = w;
  }

  setChange(val) {
    this.change = val;
  }
}

export default Connection;
