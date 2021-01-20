const fs = require('fs')
const path = require('path')
const packages = require('../package.json')
const projectPath = path.resolve(path.dirname(__dirname))
const rootPath = path.resolve(projectPath, './src')
const platform = process.argv.pop()

const getDtsConfig = () => {
  const lazyLoader = {
    web: () => _mergeDTS({
      name: 'sdk',
      prefix: 'h5-sdk',
      main: 'h5-sdk/src/entry.web',
      out: 'dist/web-sdk/index.d.ts',
      types: ['zepto'],
      exclude: ['**/*.node.ts', '**/*.mini.ts']
    }),
    mini: () => _mergeDTS({
      name: platform + '-sdk',
      prefix: platform + '-sdk',
      main: platform + '-sdk/src/entry.mini',
      out: 'dist/mini-sdk/index.d.ts',
      exclude: ['**/*.web.ts', '**/*.node.ts']
    }),
    node: () => _mergeDTS({
      name: platform + '-sdk',
      prefix: platform + '-sdk',
      main: platform + '-sdk/src/entry.node',
      out: 'dist/node-sdk/node.d.ts',
      exclude: ['**/*.web.ts', '**/*.mini.ts']
    })
  }[platform]
  if (!lazyLoader) {
    throw new TypeError(`未找到${platform}，当前支持 web|mini|node 创建dts文件`)
  }
  return lazyLoader()
}

const getPkgConfig = () => {
  const lazyLoader = {
    web: () => _mergePkg({
      name: 'h5-sdk',
      description: 'sdk.js 用于Web程序开发的sdk',
      scripts: {},
      files: ['*'],
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

function makeDtsConfig () {
  console.log('⚽️ Create index.d.ts')
  return require('dts-generator').default(getDtsConfig())
}

function makePkgConfig () {
  console.log('⚽️ Create package.json')
  const pkgfile = path.resolve(projectPath, `./dist/${platform}-sdk/package.json`)
  const pkgconfig = getPkgConfig()
  fs.writeFileSync(pkgfile, JSON.stringify(pkgconfig, null, 2), 'utf-8')
}

function _mergePkg (newpkg) {
  return Object.assign(packages, { private: false }, newpkg)
}

function _mergeDTS (config) {
  const def = {
    baseDir: rootPath,
    project: projectPath,
    out: 'index.d.ts',
    // sendMessage: console.log,
    exclude: [
      'node_modules/**/*.d.ts',
      'src/scheduler/*.ts',
      '**/*.js',
      '**/*.d.ts',
    ]
  }
  if (config.exclude) {
    def.exclude.push(...config.exclude)
    delete config.exclude
  }
  return Object.assign(def, config)
}
