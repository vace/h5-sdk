const rollup  = require('rollup')
const dts  = require("rollup-plugin-dts").default
const postcss  = require('rollup-plugin-postcss')
const fs = require('fs')
const path = require('path')
const version = require('../package.json').version

const banner = `/*!
 * @overview h5-sdk@${version} ${(new Date).toLocaleString()}
 * @copyright (c) 2018-present, MaQu, Inc.
 * @authors Vace<i@ahmq.net>
 * @license Released under the MIT License.
 */\n`

/**
 * 目前ts还不能生成单文件声明，此方法用于生成同步的vscode定义文件
 * 方便用于开发，目前只生成web版本
 * @see https://github.com/microsoft/TypeScript/issues/4433
 * @see https://github.com/microsoft/TypeScript/pull/5090
 * create dts
 * tsc -t es5 ./src/entry.web.ts --declaration --emitDeclarationOnly --out dist/index.js --module amd
 */

async function package () {
  const output = 'sdk.d.ts'

  const config = {
    input: "./src/entry.web.ts",
    output: [{ file: output, format: "es" }],
    plugins: [
      dts(),
      postcss({
        plugins: [],
        extract: 'dist/sdk.css',
        extensions: ['.css', '.less']
      })
    ],
  }

  const bundle = await rollup.rollup(config)

  const ret = await bundle.write({
    file: output,
    format: 'es',
    name: 'library',
    sourcemap: false
  })

  const filename = path.resolve(__dirname, '../', output)
  const content = await fs.promises.readFile(filename, 'utf-8')
  const declaration = `${banner}
declare namespace sdk {
${content.replace(/declare /ig, '')}
}`
  await fs.promises.writeFile(filename, declaration)
  return filename
}

package().then(console.log).catch(console.error)
