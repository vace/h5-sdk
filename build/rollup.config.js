import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'

import { uglify } from 'rollup-plugin-uglify'
// import cssnext from 'postcss-cssnext'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { version } from '../package.json'

 const banner = `/*!
 * @overview h5-sdk@${version} ${(new Date).toLocaleString()}
 * @copyright (c) 2018-present, MaQu, Inc.
 * @authors Vace<i@ahmq.net>
 * @license Released under the MIT License.
 */\n`

// BUILD 格式为 Plantform.Env
//1. Web.Development 用于网页应用debug模式
//2. Web.Production 用于网页应用生产模式

const [Plantform, BuildEnv] = (process.env.BUILD || '').toLowerCase().split('.')
const isDevelopment = BuildEnv === 'development'
const isProduction = BuildEnv === 'production'
const isWatchMode = process.env.ROLLUP_WATCH === 'true'

console.log(`Make Build Plantform: ${Plantform}，Env：${BuildEnv}`)

const configure = {}

const createReplace = () => {
  return replace({
    '__VERSION__': version,
    'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
    // 编译平台
    '__PLANTFORM__': Plantform
  })
}

// WEB 端
if (Plantform === 'web') {
  Object.assign(configure, {
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
      createReplace(),
      commonjs(),
      isWatchMode && isDevelopment && serve({
        port: 1235,
        contentBase: ['dist', 'demo']
      }),
      isProduction && uglify({
        output: {
          comments: (node, { value, type }) => type == "comment2" && /h5-sdk/i.test(value)
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
    output: {
      file: isDevelopment ? './dist/sdk.dev.js' : './dist/sdk.js',
      format: 'umd',
      name: 'sdk',
      globals: {
        'whatwg-fetch': 'fetch'
      },
      banner
    }
  })
} else if (Plantform === 'mini') {
  Object.assign(configure, {
    input: './src/mini-entry.ts',
    plugins: [
      typescript(),
      json(),
      resolve(),
      createReplace(),
      commonjs()
    ].filter(val => !!val),
    watch: {
      include: 'src/**',
      exclude: 'node_modules/**'
    },
    context: 'window',
    output: {
      file: './dist/sdk.mini.js',
      format: 'cjs',
      name: 'sdk',
      banner
    }
  })
}

export default configure