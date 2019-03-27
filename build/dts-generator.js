const path = require('path')
const project = path.dirname(__dirname)

require('dts-generator').default({
  name: 'h5-sdk',
  main: 'h5-sdk/src/web-entry',
  prefix: 'h5-sdk',
  project,
  out: 'index.d.ts',
  // resolveModuleId({ currentModuleId }) {
  //   if (currentModuleId.indexOf('initialize') !== -1) {
  //     return null
  //   }
  // }
  exclude: ['node_modules/**/*.d.ts', 'src/scheduler/*.ts', '*.spec.ts', '*.js']
});
