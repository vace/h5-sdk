import { uglify } from 'rollup-plugin-uglify'
import rollup from './rollup.web.base'

rollup.plugins.push(uglify({
  output: {
    comments: (node, { value, type }) => type == "comment2" && /h5-sdk/i.test(value)
  }
}))

rollup.output.file = './dist/web-sdk/sdk.js'
rollup.output.sourcemap = true

console.log('🙏 Create ·web-sdk/sdk.js·')

export default rollup
