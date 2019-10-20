import store from '../adapters/store/index'
import { now } from '../functions/underscore'

type ICacheObject = {
  key: string
  value: any
  hot: number
}

export default function cacher (cacheKey: string) {
  // 最大缓存长度
  const maxLength = 10
  // 读取当前缓存项目
  const cache: ICacheObject[] = store.get(cacheKey) || []

  const find = (key: string) => cache.find(obj => obj.key === key)

  // 取值
  const get = (key: string) => {
    const hit = find(key)
    if (hit) {
      return hit.value
    }
    return null
  }
  // 设置
  const set = (key: string, value: any) => {
    const hit = find(key)
    if (hit) {
      cache.splice(cache.indexOf(hit), 1)
    }
    cache.unshift({ key, value, hot: now() })
    // 默认只缓存最新的10个值，其他的会被忽略
    store.set(cacheKey, cache.slice(0, maxLength))
    return value
  }

  const remove = (key: string) => {
    const hit = find(key)
    if (hit) {
      cache.splice(cache.indexOf(hit), 1)
      store.set(cacheKey, cache)
    }
  }

  return { get, set, remove }
}
