/**
 * @module sdk
 */

import { isArray } from './is'

// https://github.com/jashkenas/underscore/blob/master/underscore.js

/*
https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
想象每天上班大厦底下的电梯。把电梯完成一次运送，类比为一次函数的执行和响应。假设电梯有两种运行策略 throttle 和 debounce ，超时设定为15秒，不考虑容量限制。
throttle 策略的电梯。保证如果电梯第一个人进来后，15秒后准时运送一次，不等待。如果没有人，则待机。
debounce 策略的电梯。如果电梯里有人进来，等待15秒。如果又人进来，15秒等待重新计时，直到15秒超时，开始运送。
*/


/**
 * 获取当前时间点的毫秒数
 */
export const now: () => number = Date.now

/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 */
export function throttle(func: Function, wait: number) {
  let ctx: any,
      args: any | IArguments,
      rtn: any,
      timeoutID: any,
      last: number = 0

  return function throttled(this: any) {
    ctx = this
    args = arguments
    var delta = now() - last
    if (!timeoutID)
      if (delta >= wait) call()
      else timeoutID = setTimeout(call, wait - delta)
    return rtn
  }

  function call() {
    timeoutID = 0
    last = now()
    rtn = func.apply(ctx, args)
    ctx = null
    args = null
  }
}

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 */
export function debounce<T extends Function>(func: T, wait: number = 100, immediate: boolean = false): T {
  var timeout: any,
      args: any,
      context: any,
      timestamp: number,
      result: any
  function later() {
    var last = now() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }

  var debounced: any = function (this: any) {
    context = this
    args = arguments
    timestamp = now()
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }

  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args)
      context = args = null
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

/**
 * 生成min-max之间的小数
 * @example
 * sdk.random(0, 100) // 生成0 - 100之间的整数
 * sdk.random(0, 100) / 100 // 生成 0.00 - 1.00 之间的小数
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
export function random(min: number, max?: number): number {
  if (max == null) {
    max = min
    min = 0
  }
  return min + Math.floor(Math.random() * (max - min + 1))
}

/**
 * 打乱数组
 *
 * @export
 * @template T
 * @param {T[]} array 需要打乱的数组
 * @returns {T[]} 打乱后的数组
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    let j = random(i)
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

/**
 * 遍历对象或者数组
 * @param {ArrayOrObject} obj 需要遍历的对象
 * @param {Function} iteratee 回调函数
 * @param {any} context 作用域
 */
export function each(obj: any, iteratee: (val: unknown, key: (number | string), _this: unknown) => void, context?: any) {
  // 作用域绑定
  if (context) {
    iteratee = iteratee.bind(context)
  }
  let i: any, length: number
  if (isArray(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj)
    }
  } else {
    var keys = Object.keys(obj)
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj)
    }
  }
  return obj
}

/**
 * @example
 * sdk.pick({a: 1, b: 2, c: 3}, ['a', 'b']) // {a: 1, b: 2}
 * sdk.pick({a: 1, b: 2, c: 3}, {a: 'aa', b: 'bb'}) // {aa: 1, bb: 2}
 * @param obj 对象
 * @param map 文本
 */
export function pick<T> (obj: T, map: string[] | Record<string, any>): T {
  const res = Object.create(null)
  each(map, (value: any, key: any) => {
    res[value] = typeof key === 'string' ? obj[key] : obj[value]
  })
  return res
}


/**
 * 创建一个会缓存 func 结果的函数。 如果提供了 hashFn，就用 hashFn 的返回值作为 key 缓存函数的结果。 默认情况下用第一个参数作为缓存的 key。 func 在调用时 this 会绑定在缓存函数上。
 * @param {any} func 计算函数体
 * @param {any} hashFn 可选的函数缓存key
 */
export function memoize<T>(func: Function, hashFn?: (...arg: any[]) => string): T {
  const memoized: any = function (this: any, key: string) {
    const cache = memoized.cache
    const arg: any = arguments
    const address = '' + (hashFn ? hashFn.apply(this, arg) : key)
    if (!cache.has(address)) cache.set(address, func.apply(this, arg))
    return cache.get(address)
  }
  memoized.cache = new Map()
  return memoized
}
