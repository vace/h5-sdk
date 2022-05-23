import { global } from '../functions/common'
import Config from './Config'

const InitailConfig = global['_SDK']

// 默认配置导入
if (InitailConfig) {
  Config.set(InitailConfig)
}

export default Config
