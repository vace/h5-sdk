import { isDef } from "../functions/common"

export interface IStoreUseProxy {
  get (key: string): any
  set (key: string, val: any): void
  keys (): string[]
  remove (key: string): void
  clear (): void
}

let storage: IStoreUseProxy

export default {
  /** 使用自定义存储器 */
  use (usestorage: IStoreUseProxy) {
    storage = usestorage
    return this
  },
  /** 读取缓存 */
  get(key: string, _default?: any) {
    let val = storage.get(key)
    return isDef(val) ? val : _default
  },
  /** 设置缓存 */
  set(key: string, data: any) {
    if (data === null) {
      return storage.remove(key)
    }
    storage.set(key, data)
  },
  /** 获取缓存keys列表 */
  keys() {
    return storage.keys()
  },
  /** 移除指定缓存 */
  remove(key: string) {
    storage.remove(key)
  },
  /** 清空缓存 */
  clear() {
    storage.clear()
  },
  /** 遍历缓存 */
  each(fn: (value: any, key: string) => void) {
    const keys: string[] = this.keys()
    for (const key of keys) fn(this.get(key), key)
  }
}
