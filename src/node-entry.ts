/**
 * Nodejs 端
 */

/**
 * 版本号
 */
export const version = '__VERSION__'

/**
 * 导出辅助函数类
 */
export * from './config'
export * from './functions/index.node'
export * from './factory/index.node'
export * from './plugins/index.node'

import {
  Http,
  Auth,
  User,
  App
} from './factory/index.node'

const exportGetter = (key: string, get: any) => {
  Object.defineProperty(exports, key, { get })
}
exportGetter('http', () => Http.instance)
exportGetter('auth', () => Auth.instance)
exportGetter('user', () => User.instance)
exportGetter('app', () => App.instance)
