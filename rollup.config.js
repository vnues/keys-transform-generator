import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import dts from 'rollup-plugin-dts';

const extensions = ['.ts', '.js'];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'keysTransformGenerator',
      sourcemap: false,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: false,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'es/index.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'typings/index.d.ts', format: 'es' }],
    plugins: [
      typescriptPaths({
        preserveExtensions: true,
      }),
      dts(),
    ],
  },
];
