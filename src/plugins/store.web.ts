import store, { IStoreUseProxy } from './store'
import { isDef, isString } from "../functions/common"

const webstore = window.localStorage

const proxy: IStoreUseProxy = {
  get (key: string) {
    const v = webstore.getItem(key)
    if (isDef(v) && isString(v)) {
      try {
        return JSON.parse(v)
      } catch (error) {
        return null
      }
    }
    return v
  },
  set (key: string, value: any) {
    return webstore.setItem(key, JSON.stringify(value))
  },
  remove (key: string) {
    webstore.removeItem(key)
  },
  keys () {
    const keys: string[] = []
    for (let index = 0; index < webstore.length; index++) {
      const key = <string>webstore.key(index)
      keys.push(key)
    }
    return keys
  },
  clear () {
    webstore.clear()
  }
}

export default store.use(proxy)
