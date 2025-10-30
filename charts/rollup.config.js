import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-native-reanimated', // ensure not parsed
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
      include: [
        'node_modules/react-native-svg/**',
        'node_modules/@babel/**',
        'node_modules/@react-native/**',
      ],
    }),
    json(),
  ],
};

export default [
  {
    ...commonConfig,
    output: { file: pkg.module, format: 'esm', sourcemap: true },
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
  {
    ...commonConfig,
    output: { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
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
  {
    input: 'src/index.ts',
    output: { file: pkg.types, format: 'esm' },
    plugins: [dts({ tsconfig: './tsconfig.json' })],
    external,
  },
];
