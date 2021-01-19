import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

import { banner, useReplace } from './common'

console.log('🙏 Create mini-sdk/sdk.dev.js·')

export default {
  input: './src/entry.mini.ts',
  plugins: [
    json(),
    typescript({
      // verbosity: 3,
      tsconfigDefaults: {},
      tsconfig: "tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          removeComments: false,
          target: 'ES2016',
          module: 'es2015'
        }
      }
    }),
    resolve(),
    useReplace({
      platform: 'mini',
      env: 'production'
    })
  ].filter(val => !!val),
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  context: 'window',
  output: {
    file: './dist/mini-sdk/sdk.js',
    format: 'cjs',
    name: 'sdk',
    banner
  }
}
