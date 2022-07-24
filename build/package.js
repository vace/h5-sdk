const fs = require('fs')
const path = require('path')
const packages = require('../package.json')
const projectPath = path.resolve(path.dirname(__dirname))
const rootPath = path.resolve(projectPath, './src')
const platform = process.argv.pop()
const rollup = require('rollup')
const dts = require("rollup-plugin-dts").default
const postcss = require('rollup-plugin-postcss')

const getPkgConfig = () => {
  const lazyLoader = {
    web: () => _mergePkg({
      name: 'h5-sdk',
      description: 'sdk.js 用于Web程序开发的sdk',
      scripts: {},
      files: ['*'],
      main: 'index.js',
      devDependencies: {},
      dependencies: {
        "@types/zepto": packages.dependencies['@types/zepto']
      }
    }),
    mini: () => _mergePkg({
      name: 'mini-sdk',
      // @link https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html
      miniprogram: "",
      description: 'sdk.js 用于小程序开发的sdk',
      scripts: {},
      files: ['*'],
      devDependencies: {},
      dependencies: {}
    }),
    node: () => _mergePkg({
      name: 'node-sdk',
      description: 'sdk.js 用于Nodejs程序开发的sdk',
      scripts: {},
      files: ['*'],
      devDependencies: {},
      dependencies: {}
    }),
  }[platform]
  if (!lazyLoader) {
    throw new TypeError(`未找到${platform}，当前支持 web|mini|node 创建package.json文件`)
  }
  return lazyLoader()
}

makeDtsConfig();
makePkgConfig();

async function makeDtsConfig () {
  console.log('⚽️ Create index.d.ts')
  const output = `./dist/${platform}-sdk/index.d.ts`
  const config = {
    input: `./src/entry.${platform}.ts`,
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
  const ret = await bundle.write({ file: output, format: 'es', name: 'library', sourcemap: false })
}

function makePkgConfig () {
  console.log('⚽️ Create package.json')
  const pkgfile = path.resolve(projectPath, `./dist/${platform}-sdk/package.json`)
  const devjs = path.resolve(projectPath, `./dist/${platform}-sdk/index.js`)
  const pkgconfig = getPkgConfig()
  fs.writeFileSync(pkgfile, JSON.stringify(pkgconfig, null, 2), 'utf-8')
  if (platform === 'web') {
    fs.writeFileSync(devjs, fs.readFileSync(path.resolve(__dirname, '../index.js'), 'utf-8'), 'utf-8')
  }
}

function _mergePkg (newpkg) {
  return Object.assign(packages, { private: false }, newpkg)
}
