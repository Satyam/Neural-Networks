export const rand = {
  perm: (n) => {
    const m = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < n; i++) {
      const j = rand.intn(i + 1);
      m[i] = m[j];
      m[j] = i;
    }
    return m;
  },

  intn: (max) => Math.floor(Math.random() * Math.floor(max)),
};
