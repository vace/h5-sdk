import store, { IStoreUseProxy } from './store'
import { isDef } from "../functions/common"

/**
 * 小程序中加入了中间缓存，减少io操作
 */
declare var wx: any
let memocache = new Map()

const proxy: IStoreUseProxy = {
  get(key: string) {
    const v = memocache.get(key)
    if (isDef(v)) {
      return v
    }
    const readed = wx.getStorageSync(key)
    if (isDef(readed)) {
      memocache.set(key, readed)
    }
    return isDef(readed) ? readed : null
  },
  set(key: string, value: any) {
    wx.setStorage({ key, data: value })
    memocache.set(key, value)
  },
  remove(key: string) {
    memocache.delete(key)
    wx.removeStorage({ key })
  },
  keys() {
    return wx.getStorageInfoSync().keys || []
  },
  clear() {
    memocache.clear()
    wx.clearStorage()
  }
}
export default store.use(proxy)
