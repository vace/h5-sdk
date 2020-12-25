import store from './store'
import { now, isDef, isArray } from '../functions/common'

/**
 * 热点数据缓存
 */
type ICacheObject = {
  key: string
  value: any
  hot: number
}

export default function hotcache(cacheKey: string, maxLength: number = 16) {
  // 读取当前缓存项目
  let cache: ICacheObject[]

  const _lzcache: () => ICacheObject[] = () => {
    if (!isDef(cache)) {
      cache = store.get(cacheKey)
      !isArray(cache) && (cache = [])
    }
    return cache
  }

  const _find = (key: string) => _lzcache().find(obj => obj.key === key)

  const _spliced = (key) => {
    const hit = _find(key)
    return isDef(hit) && cache.splice(cache.indexOf(hit), 1)
  }

  // 取值
  const get = (key: string, _default?: any) => {
    const hit = _find(key)
    return isDef(hit) ? hit.value : _default
  }
  // 设置
  const set = (key: string, value: any) => {
    _spliced(key)
    const cache = _lzcache()
    cache.unshift({ key, value, hot: now() })
    // 排序后只缓存最新的值
    store.set(cacheKey, cache.slice(0, maxLength))
    return value
  }

  const remove = (key: string) => {
    if (_spliced(key)) {
      store.set(cacheKey, _lzcache())
    }
  }

  return { get, set, remove }
}
