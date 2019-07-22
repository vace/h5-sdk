import createStoreWeb from './store.web'
import createStoreMini from './store.mini'
import { IStore } from './interface';

let store: IStore

/**
 * @var {string} 这个变量由rollup根据环境替换
 */
let platform = '__PLANTFORM__'

if (platform === 'web') {
  store = createStoreWeb()
} else if (platform === 'mini') {
  store = createStoreMini()
}

export default {
  get store (): IStore {
    return store
  },
  get (key: string, _defaultValue?: any) {
    let val: string = store.read(key)
    return val !== undefined ? val : _defaultValue
  },
  set (key: string, value: any) {
    if (value == null) {
      return this.remove(key)
    }
    return store.write(key, value)
  },
  remove (key: string) {
    return store.remove(key)
  },
  each (fn: (value: any, key: string) => void) {
    const keys: string[] = store.keys()
    for (const key of keys) fn(this.get(key), key)
  },
  clearAll () {
    return store.clearAll()
  }
}
