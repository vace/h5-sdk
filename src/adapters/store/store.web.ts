import { IStore } from './interface'
import { localStorage } from '../../utils/global'

/**
 * web localStorage 版本
 * @returns {IStore}
 */
export default function createStoreWeb (): IStore {
  return {
    read(key) {
      const strVal: string = localStorage.getItem(key)
      let val: any
      if (typeof strVal === 'string' && strVal) {
        try { val = JSON.parse(strVal) }
        catch (e) { }
      }
      return val
    },
    write(key, data) {
      return localStorage.setItem(key, JSON.stringify(data))
    },
    keys() {
      const keys: string[] = []
      for (let index = 0; index < localStorage.length; index++) {
        const key = <string>localStorage.key(index)
        keys.push(key)
      }
      return keys
    },
    remove(key) {
      return localStorage.removeItem(key)
    },
    clearAll() {
      return localStorage.clear()
    }
  }
}