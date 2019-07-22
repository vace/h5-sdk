import { IStore } from './interface'

declare var wx: any

/**
 * 小程序版本
 * @returns {IStore}
 */
export default function createStoreMini (): IStore {
  return {
    read (key) {
      return wx.getStorageSync(key)
    },
    write (key, data) {
      return wx.setStorageSync(key, data)
    },
    keys () {
      const info: any = wx.getStorageInfoSync()
      const keys: string[] = info.keys
      return keys
    },
    remove (key) {
      return wx.removeStorageSync(key)
    },
    clearAll () {
      return wx.clearStorageSync()
    }
  }
}
