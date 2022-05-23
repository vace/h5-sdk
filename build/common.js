import replace from '@rollup/plugin-replace'
import { version } from '../package.json'

const banner = `/*!
 * @overview h5-sdk@${version} ${(new Date).toLocaleString()}
 * @copyright (c) 2018-present, MaQu, Inc.
 * @authors Vace<i@ahmq.net>
 * @license Released under the MIT License.
 */\n`

const isWatchMode = process.env.ROLLUP_WATCH === 'true' || process.argv.indexOf('--watch') !== -1
const useReplace = (config) => replace({
  '__VERSION__': version,
  'process.env.NODE_ENV': JSON.stringify(config.env ? 'development' : 'production'),
  // 编译平台
  '__PLATFORM__': config.platform
})

export {
  version,
  banner,
  isWatchMode,
  useReplace
}
