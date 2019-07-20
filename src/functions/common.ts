/**
 * 字符串转驼峰
 * ```js
 * camelize('padding-left') // paddingLeft
 * ```
 */
export function camelize (str: string): string {
  return str.replace(/-+(.)?/g, function (match, chr: string) { return chr ? chr.toUpperCase() : '' })
}

/** 空函数 */
export function noop () {}

/** 原样返回 */
export function alway (val: any) {
  return val
}

/**
 * 将驼峰字符串转换为 dasherize格式
 * sdk.dasherize('paddingLeft') // padding-left
 */
export function dasherize(str: string): string {
  return str.replace(/::/g, '/')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

/**
 * 返回一个延迟执行的`Promise`，可通过cancel取消此请求
 * ```javascript
 * const waitTask = wait(100)
 * waitTask.cancel(new Error('选择取消此操作'))
 * ```
 */
export function wait<T> (ms: number, arg?: T): Promise<T> {
  let cancel
  const _next: any = new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, Math.max(ms, 0), arg)
    cancel = (reason?: Error) => {
      clearTimeout(timeoutId)
      reject(reason)
    }
  })
  _next.cancel = cancel
  return _next
}

let _uid = 0

/** 生成带前缀的唯一ID */
export function uid(prefix: string = ''): string {
  return `${prefix}${++_uid}`
}

/** 生成36位uuid */
export function uuid (): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    const r = Math.random() * 16 | 0; // eslint-disable-line
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
    return v.toString(16);
  })
}

/**
 * 生成指定长度随机字符串
 * @param {number} [len=8]
 */
export function randomstr (len: number = 8): string {
  let str = '', repeat = Math.ceil(len / 8)
  while (repeat --) {
    str += Math.random().toString(36).slice(2)
  }
  return str.slice(0, len).toUpperCase()
}

/**
 * 将数组参数赋值为变量
 * ```js
 * var arr = [1, 2, 3]
 * sdk.spread(function (a, b, c) {
 *  console.log(a, b, c)// 1, 2, 3
 * })(arr);
 * ```
 * @param {Function} callback
 * @returns {Function}
 */
export function spread (callback: Function) {
  return function wrap (arr: any[]) {
    return callback.apply(null, arr)
  }
}
