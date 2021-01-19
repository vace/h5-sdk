import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
// import { devDependencies, dependencies } from '../package.json'

import { banner, useReplace } from './common'

console.log('🙏 Create node-sdk/sdk.js·')

export default {
  input: './src/entry.node.ts',
  plugins: [
    json(),
    typescript({
      // verbosity: 3,
      tsconfigDefaults: {},
      tsconfig: "tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          removeComments: true,
          target: 'ES2016',
          module: 'es2015'
        }
      }
    }),
    resolve(),
    useReplace({
      platform: 'node',
      env: 'production'
    })
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  output: {
    file: './dist/node-sdk/sdk.js',
    format: 'cjs',
    name: 'sdk',
    banner
  }
}
