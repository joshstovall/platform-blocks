import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
];

const commonConfig = {
  input: 'src/index.ts',
  external,
  plugins: [
    peerDepsExternal(),
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
    json(),
  ],
};

export default [
  // ESM build
  {
    ...commonConfig,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true, // ensure single-file output despite internal dynamic imports
    },
    plugins: [
      ...commonConfig.plugins,
      typescript({
        tsconfig: './tsconfig.esm.json',
        declaration: false,
        declarationMap: false,
        jsx: 'react-jsx',
        outDir: './lib/esm',
        rootDir: './src',
      }),
    ],
  },
  // CJS build
  {
    ...commonConfig,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true,
    },
    plugins: [
      ...commonConfig.plugins,
      typescript({
        tsconfig: './tsconfig.cjs.json',
        declaration: false,
        declarationMap: false,
        jsx: 'react-jsx',
        outDir: './lib/cjs',
        rootDir: './src',
      }),
    ],
  },
];
