import store, { IStoreUseProxy } from './store'
import { isDef, isString } from "../functions/common"

/**
 * Nodejs 中使用内存存储
 */
let memocache = new Map()

const proxy: IStoreUseProxy = {
  get(key: string) {
    const v = memocache.get(key)
    return isDef(v) ? v : null
  },
  set(key: string, value: any) {
    return memocache.set(key, value)
  },
  remove(key: string) {
    memocache.delete(key)
  },
  keys() {
    const keys: string[] = []
    memocache.forEach((v, k) => keys.push(k))
    return keys
  },
  clear() {
    memocache.clear()
  }
}
export default store.use(proxy)
