
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

import Oauth from './factory/Oauth';
import User from './factory/User';
import App from './factory/App';
import Http from './factory/Http';
import Res from './factory/Res';
import UiMusic from './factory/UiMusic';
import Emitter from './factory/Emitter';

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

// 导出getter 模块

const exportGetter = (key: string, get: any) => {
  Object.defineProperty(exports, key, { get })
}
exportGetter('app', () => App.instance)
exportGetter('http', () => Http.instance)
exportGetter('res', () => Res.instance)
exportGetter('oauth', () => Oauth.instance)
exportGetter('user', () => User.instance)
//! 这里只读_instance，部分情况可能会使用 if (sdk.music) 判断music是否存在
exportGetter('music', () => UiMusic._instance)
exportGetter('emitter', () => Emitter.instance)

import './scheduler/index'
