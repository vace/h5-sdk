const path = require('path')
const rootPath = path.dirname(__dirname)

const options = {
  project: rootPath,
  name: 'h5-sdk',
  main: 'h5-sdk/src/web-entry',
  prefix: 'h5-sdk',
  out: 'index.d.ts',
  types: ['zepto', 'store', 'blueimp-md5'],
  // resolveModuleId({ currentModuleId }) {
  //   if (currentModuleId.indexOf('initialize') !== -1) {
  //     return null
  //   }
  // }
  sendMessage: console.log,
  exclude: [
    'node_modules/**/*.d.ts',
    'src/scheduler/*.ts',
    'src/mini-entry.ts',
    'src/node-entry.ts',
    'src/**/*.spec.ts',
    'dist/**',
    'build/**',
    'docs/**',
    'demo/**',
    'miniprogram/**',
    '*.js',
    'index.d.ts'
  ]
}

require('dts-generator').default(options);
