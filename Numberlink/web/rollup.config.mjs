import terser from '@rollup/plugin-terser';

export default {
  input: 'main.mjs',
  output: {
    file: 'numberlink.js',
    format: 'cjs',
    banner: `#!/usr/bin/node
    /*
    Code converted to JavaScript by Daniel Barreiro from the original Golang
    by Thomas Ahle in https://github.com/thomasahle/numberlink licensed under
    GNU Affero General Public License v3.0
    as requested by the original author.
    Parts from the Golang source which is BSD licensed.
    */
   `,
  },
  plugins: [terser()],
};
