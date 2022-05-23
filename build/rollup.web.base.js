import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
// import autoprefixer from 'autoprefixer'

import { banner, useReplace } from './common'

const isDevelopment = process.argv.some(v => v.indexOf('rollup.web.dev.js') !== -1)

export default {
  input: './src/entry.web.ts',
  plugins: [
    json(),
    typescript(),
    postcss({
      plugins: [
        // autoprefixer()
      ],
      extract: 'sdk.css',
      extensions: ['.css', '.less']
    }),
    resolve({ browser: true }),
    useReplace({
      platform: 'web',
      env: isDevelopment ? 'development' : 'production'
    })
  ],
  moduleContext: {
    'whatwg-fetch': 'window'
  },
  context: 'window',
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  output: {
    file: './dist/web-sdk/sdk.dev.js',
    format: 'umd',
    sourcemap: false,
    name: 'sdk',
    globals: {
      'whatwg-fetch': 'fetch'
    },
    banner
  }
}
