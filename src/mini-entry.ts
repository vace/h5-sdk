/**
 * 小程序SDK集成
 */

import {
  Http,
  Auth,
  User
} from './factory/index.mini'

/**
 * 版本号
 */
export const version = '__VERSION__'

/**
 * 导出辅助函数类
 */
export * from './config'
export * from './functions/index.mini'
export * from './factory/index.mini'
export * from './plugins/index.mini'
// export * from './factory/index'



const exportGetter = (key: string, get: any) => {
  Object.defineProperty(exports, key, { get })
}
exportGetter('http', () => Http.instance)
exportGetter('auth', () => Auth.instance)
exportGetter('user', () => User.instance)
