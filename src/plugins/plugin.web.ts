import { isDef, isPromise, isString } from '../functions/common'
import Res from '../factory/Res.web'
import tasker, { ITaskerPromise } from './tasker'

/**
 * @example
 * ```js
 * - 前端使用插件流程
 * sdk.plugin.install('./app/plugin-modal.js')
 * sdk.plugin.use('showModal').then(modal => {
 *  model.open({ title: 'xxxx', ... })
 * })
 * 
 * - 定义一个插件的流程
 * sdk.plugin.define('showModal', fn)
 * ```
 */

export const store: Map<string, ITaskerPromise<any>> = new Map()

/** 插件系统配置 */
export const loader = new Res({
  autoStart: true
})

function initPlugin (name: string) {
  let plugin = store.get(lower(name))
  if (!plugin) {
    plugin = tasker()
    store.set(name, plugin)
  }
  return plugin
}

/** 安装一个插件 */
export function install(src: any) {
  loader.add(src)
  return { use, define }
}

/** 定义一个插件 */
export function define (name: string, fn: any) {
  const plugin = initPlugin(name)
  return plugin.resolve(fn)
}

/** 使用一个插件 */
export function use (name: string) {
  return initPlugin(name)
}

function lower (str: string) {
  return str && isString(str) ? str.toLowerCase() : str
}
