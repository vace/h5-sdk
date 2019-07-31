import { IStore } from './interface'
/**
 * Nodejs 版本存储，使用内存存储
 * @returns {IStore}
 */
export default function createStoreNode(): IStore {
  let cache = Object.create(null)

  return {
    read(key) {
      return cache[key]
    },
    write(key, data) {
      return cache[key] = data
    },
    keys() {
      return Object.keys(cache)
    },
    remove(key) {
      return delete cache[key]
    },
    clearAll() {
      cache = Object.create(null)
      return true
    }
  }
}
