const fs = require('fs')
const path = require('path')
const projectPath = path.resolve(path.dirname(__dirname))
const rootPath = path.resolve(projectPath, './src')

const dts = {
  web: _mergeDTS({
    main: 'h5-sdk/src/entry.web',
    out: 'index.d.ts',
    types: ['zepto'],
    exclude: ['**/*.node.ts', '**/*.mini.ts']
  }),
  mini: _mergeDTS({
    main: 'h5-sdk/src/entry.mini',
    out: 'miniprogram/index.d.ts',
    exclude: ['**/*.web.ts', '**/*.node.ts']
  }),
  node: _mergeDTS({
    main: 'h5-sdk/src/entry.node',
    out: 'dist/node.d.ts',
    exclude: ['**/*.web.ts', '**/*.mini.ts']
  })
}

export function createDts (plat = 'web') {
  console.log('dts build:', plat)
  const options = dts[plat]
  if (!options) throw new Error(`plat not defined:` + plat)
  require('dts-generator').default(options);
}

export function createMiniProgramPackage () {
  const pkg = require('../package.json')
  const template = {
    name: 'mini-sdk',
    version: pkg.version,
    description: 'sdk.js 用于小程序的sdk',
    main: 'dist/sdk.js',
    author: 'Vace(ocdo@qq.com)',
    miniprogram: 'dist',
    types: 'index.d.ts',
    files: [
      'index.d.ts',
      'dist/sdk.js'
    ],
    devDependencies: {},
    dependencies: {}
  }
  const filename = path.resolve(projectPath, './miniprogram/package.json')
  fs.writeFileSync(filename, JSON.stringify(template, null, 2), 'utf-8')
  console.log('write miniprogram packagejson ', filename)
}

function _mergeDTS (config) {
  const def = {
    baseDir: rootPath,
    project: projectPath,
    name: 'h5-sdk',
    prefix: 'h5-sdk',
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
