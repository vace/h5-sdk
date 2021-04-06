import serve from 'rollup-plugin-serve'
import rollup from './rollup.web.base'
import { isWatchMode } from './common'

if (isWatchMode) {
  rollup.plugins.push(serve({
    port: 1235,
    contentBase: ['dist', 'demo']
  }))
} else {
  rollup.output.sourcemap = true
}

console.log('🙏 Create ·web-sdk/sdk.dev.js·')

export default rollup
