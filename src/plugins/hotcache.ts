import store from './store'
import { now, isDef, isArray } from '../functions/common'

/**
 * 热点数据缓存，采用LRU方式，缓存固定队列数值
 */

type ICacheObject = {
  key: string
  value: any
  hot: number
}

export default function hotcache(cacheKey: string, maxLength: number = 16) {
  // 读取当前缓存项目
  let hotCacheList: ICacheObject[]
  // 当前内存缓存
  const memocache = new Map()
  // lzcache
  const _getHotList: () => ICacheObject[] = () => {
    if (!isDef(hotCacheList)) {
      hotCacheList = store.get(cacheKey)
      if (!isArray(hotCacheList)) {
        hotCacheList = []
      }
    }
    return hotCacheList
  }

  // 查找key
  const _find = (key: string) => _getHotList().find(obj => obj.key === key)
  // 移除key
  const _spliced = (key: string) => {
    const hit = _find(key)
    return isDef(hit) && hotCacheList.splice(hotCacheList.indexOf(hit), 1)
  }

  // 取值
  const get = (key: string, _default?: any) => {
    // 尝试从内存中查找
    if (memocache.has(key)) {
      return memocache.get(key)
    }
    const hit = _find(key)
    if (isDef(hit)) {
      memocache.set(key, hit.value)
      return hit.value
    }
    return _default
  }
  // 设置
  const set = (key: string, value: any) => {
    _spliced(key)
    const cache = _getHotList()
    cache.unshift({ key, value, hot: now() })
    // 排序后只缓存最新的值
    store.set(cacheKey, cache.slice(0, maxLength))
    memocache.set(key, value)
    return value
  }
  // 移除
  const remove = (key: string) => {
    if (_spliced(key)) {
      store.set(cacheKey, _getHotList())
      memocache.delete(key)
    }
  }
  // 清空
  const clearAll = () => {
    store.remove(cacheKey)
    memocache.clear()
  }

  return { get, set, remove, clearAll }
}
