/**
 * 补丁：
 * Array.prototype.find
 * Array.prototype.some
 * Object.assign
 * fetch
 * Promise
 * wx, jWeixin
 * requestAnimationFrame, cancelAnimationFrame
 * Map, Set, WeakMap, WeakSet
 */
import './assets/common.less'
import './assets/icon.less'
import './polyfill/index'

/**
 * 版本号
 */
export const version = '__VERSION__'

/**
 * 导出辅助函数类
 */
export * from './config'
export * from './functions/index'
export * from './venders/index'
export * from './plugins/index'
export * from './factory/index'
import './scheduler/index'
