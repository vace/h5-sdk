import { isDef } from "../functions/common"

export interface IStoreUseProxy {
  get (key: string): any
  set (key: string, val: any): any
  keys (): string[]
  remove (key: string): void
  clear (): void
}

let storage: IStoreUseProxy

export default {
  use (usestorage: IStoreUseProxy) {
    storage = usestorage
    return this
  },

  get(key: string, _default?: any) {
    let val = storage.get(key)
    return isDef(val) ? val : _default
  },
  set(key: string, data: any) {
    if (data === null) {
      return storage.remove(key)
    }
    return storage.set(key, data)
  },
  keys() {
    return storage.keys()
  },
  remove(key: string) {
    storage.remove(key)
  },
  clear() {
    storage.clear()
  },
  each(fn: (value: any, key: string) => void) {
    const keys: string[] = this.keys()
    for (const key of keys) fn(this.get(key), key)
  }
}
