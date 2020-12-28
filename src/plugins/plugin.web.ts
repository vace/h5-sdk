import { isDef, isString } from '../functions/common'
import Config from '../factory/Config.web'
import Res from '../factory/Res.web'
export const store = new Map()

type IUsePlugin = {
  name: string,
  version?: string
} | string

/** 插件系统配置 */
export const config = {
  rootPath: '/_lib/h5-plugins/',
}

/** 定义一个插件 */
export function define (plugin: string, anything: any) {
  store.set(lower(plugin), anything)
  return anything
}

/** 使用一个插件 */
export function use (plugin: IUsePlugin) {
  let name: string, version: string
  if (isString(plugin)) {
    [name, version = ''] = plugin.split('?')
  } else {
    name = plugin.name
    version = plugin.version || ''
  }
  const cacheKey = lower(name)
  if (store.has(cacheKey)) {
    return Promise.resolve(store.get(cacheKey))
  }
  const suffix = version ? `?v=${version}` : ''
  const pluginRoot = Config.cdn(config.rootPath + name + '.js' + suffix)
  return Res.instance.add(pluginRoot).then(() => {
    const plugin = store.get(cacheKey)
    if (!isDef(plugin)) {
      throw new TypeError(`plugin loaded empty:` + name)
    }
    return plugin
  })
}

function lower (str: string) {
  return str && isString(str) ? str.toLowerCase() : str
}
