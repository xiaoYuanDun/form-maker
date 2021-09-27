import cjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'cjs',
      file: 'dist/index.cjs.js',
    },
    {
      format: 'es',
      file: 'dist/index.esm.js',
    },
  ],
  external: ['react', 'antd'],
  plugins: [
    nodeResolve({ extensions: ['.tsx', '.ts'] }),
    cjs(),
    babel({
      extensions: ['.tsx', 'ts'],
    }),
    terser(),
  ],
};
