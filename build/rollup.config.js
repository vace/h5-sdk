import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'
import postcss from 'rollup-plugin-postcss'
import { uglify } from 'rollup-plugin-uglify'
// import cssnext from 'postcss-cssnext'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { version } from '../package.json'

 const banner = `/*!
 * h5-sdk v${version} ${(new Date).toLocaleString()}
 * Copyright (c) 2019-present, MaQu, Inc. (https://ahmq.net)
 * Authors: Vace<i@ahmq.net>
 * Released under the MIT License.
 */\n`

// BUILD 格式为 Plantform.Env
//1. Web.Devlopment 用于网页应用debug模式
//2. Web.Production 用于网页应用生产模式

const [Plantform, BuildEnv] = (process.env.BUILD || '').toLowerCase().split('.')
const isDevlopment = BuildEnv === 'devlopment'
const isProduction = BuildEnv === 'production'

console.log(`Make Build Plantform: ${Plantform}，Env：${BuildEnv}`)

export default {
  input: './src/web-entry.ts',
  plugins: [
    typescript(),
    json(),
    postcss({
      plugins: [
        autoprefixer(),
        cssnano({ safe: true })
      ],
      extract: 'dist/sdk.css',
      extensions: ['.css', '.less']
    }),
    resolve({ browser: true }),
    commonjs(),
    replace({
      '__VERSION__': version,
      'process.env.NODE_ENV': JSON.stringify(isDevlopment ? 'development' : 'production'),
      // 编译平台
      '__PLANTFORM__': Plantform
    }),
    isProduction && uglify({
      output: {
        comments: (node, { value, type }) => type == "comment2" && /@License/i.test(value)
      }
    })
  ].filter(val => !!val),
  moduleContext: {
    'whatwg-fetch': 'window'
  },
  context: 'window',
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  context: 'window',
  output: {
    file: isDevlopment ? './dist/sdk-devlopment.js' : './dist/sdk.js',
    format: 'umd',
    name: 'sdk',
    globals: {
      'whatwg-fetch': 'fetch'
    },
    banner
  }
}
