// @private 全局UID
let GLOBAL_UID = 0

/**
 * 常用原型
 */
const ObjProto = Object.prototype
const ArrProto = Array.prototype
const toString = ObjProto.toString

/** 当前环境全局变量 */
let EnvGlobal: any = {}
declare var wx: any

// @ts-ignore
if ('__PLANTFORM__' === 'web') {
  EnvGlobal = typeof window === 'undefined' ? {} : window
}
// @ts-ignore
if ('__PLANTFORM__' === 'mini') {
  EnvGlobal = typeof wx === 'undefined' ? {} : wx
}
// @ts-ignore
if ('__PLANTFORM__' === 'node') {
  EnvGlobal = typeof global === 'undefined' ? {} : global
}

export { EnvGlobal as global }

/**
 * 常用正则
 */
/** 是否为http匹配的正则表达式，存在//www.example.com的情况 */
export const regexHttp: RegExp = /^(https?:|s?ftp:)?\/\/\S+$/i
/** base64匹配的正则表达式 */
export const regexBase64: RegExp = /^data:(.+);base64,/i
/** 是否为数字的正则表达式(正数、负数、和小数) */
export const regexNumber: RegExp = /^(\-|\+)?\d+(\.\d+)?$/
/** 是否为电话号码的正则表达式 */
export const regexMobile: RegExp = /^1[3-9]\d{9}$/
/** 是否为中文的正则表达式 */
export const regexChinese: RegExp = /^[\u0391-\uFFE5]+$/
/** 使用正则匹配和分割目录 */
export const regexSplitPath: RegExp = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/

/**
 * 常用简易函数
 */
export const noop = () => { }
export const always = <T>(val: T): T => val
export const alwaysTrue = () => true
export const alwaysFalse = () => false
export const assign = Object.assign
export const keys = Object.keys

/**
 * 类型判断函数
 */
export const isArray = Array.isArray
export const isNaN = Number.isNaN
export const isNumber: (arg: any) => arg is number = _tagTester('Number')
export const isString: (arg: any) => arg is string = _tagTester('String')
export const isBoolean: (arg: any) => arg is boolean = _tagTester('Boolean')
export const isArguments: (arg: any) => arg is any[] = _tagTester('Arguments')
export const isMap: (arg: any) => arg is Map<any, any> = _tagTester('Map')
export const isError: (arg: any) => arg is Error = _tagTester('Error')
export const isSet: (arg: any) => arg is Set<any> = _tagTester('Set')
export const isRegExp: (arg: any) => arg is RegExp = _tagTester('RegExp')
export const isSymbol: (arg: any) => arg is symbol = _tagTester('Symbol')
export const isDate: (arg: any) => arg is Date = _tagTester('Date')
export const isFile: (arg: any) => arg is File = _tagTester('File')
export const isBlob: (arg: any) => arg is Blob = _tagTester('Blob')

export const isObject = (obj: any) => (typeof obj === 'object' && !!obj) || isFunction(obj)
export const isHasOwn = (obj: any, prop: any) => ObjProto.hasOwnProperty.call(obj, prop)
export const isFunction = (fun: any): fun is Function => typeof fun === 'function'
export const isNull = (nul: any): nul is null => nul === null
export const isUndefined = (val: any): val is undefined => val === void 0
export const isNullOrUndefined = (arg: unknown) => arg == null
export const isDef = <T>(val: T | null | undefined): val is T  => val != null
export const isPlainObject = (val: any) => isDef(val) && typeof val === 'object' && !isArray(val)
export const isAbsolute = (path: any) => isString(path) && path[0] === '/'
export const isHttp = (path: any) => isString(path) && regexHttp.test(path)
export const isPromise = <T>(obj: Promise<T> | any): obj is Promise<T> => isPlainObject(obj) && isFunction(obj.then) && isFunction(obj.catch)
export const isEmpty = _isEmpty
export const isBase64 = (str: any) => isString(str) && regexBase64.test(str)
export const isNative = (Ctor: unknown): boolean => typeof Ctor === 'function' && /native code/.test(Ctor.toString())
export const isWindow = (obj: any) => obj != null && obj == obj.window
export const isDocument = (obj: any) => obj != null && isDef(obj.nodeType) && obj.nodeType == obj.DOCUMENT_NODE
export const isFormData = (val: any) => val instanceof FormData
export const isNumeric = (val: any) => {
  var num = Number(val), type = typeof val
  return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false
}

/**
 * 常用数学函数
 */
export const range = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
export const random = (min: number, max?: number) => {
  if (!isDef(max)) max = min, min = 0
  return min + Math.floor(Math.random() * (max - min + 1))
}

/**
 * 常用字符串处理函数
 */
export const uid = (prefix: string = ''): string => `${prefix}${++GLOBAL_UID}`
export const uuid = _uuid
export const randomstr = _randomstr
export const camelize = (str: string): string => str.replace(/-+(.)?/g, function (match, chr: string) { return chr ? chr.toUpperCase() : '' })
/** 将驼峰字符串转换为 dasherize格式*/
export const dasherize = (str: string): string => str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase()
export const createURL = (base: string, query?: string | number | Record<any, any>) => {
  if (isEmpty(query)) return base
  return base + (/\?/.test(base) ? '&' : '?') + stringify(isNumber(query) ? {id: query} : query)
}
export const trim = (str: any) => str == null ? "" : String.prototype.trim.call(str)
// 从url中去除某些参数
export const filterURL = _filterURL
export const classnames = _classNames
export const styles = _styles
export const css = _css

/**
 * 数组/对象工具函数
 */
export const getLength: (obj: any) => number = _shallowProperty('length')
export const equal = _equal
export const remove = _remove
export const inArray = (val: any, arr: any, fromIndex?: number) => isArray(arr) && arr.indexOf(val, fromIndex) !== -1
export const uniqueArray = (arr: any[]) => Array.from(new Set(arr))
export const map = _map
export const shuffle = _shuffle
export const pick = _pick
// 遍历对象/数组，返回false时停止循环
export const each = _each
export const makeMark = (arr: string[]): Record<string, boolean> => _makeArrMarkOrMap(arr, true)
export const makeMap = (arr: string[]): Record<string, string> => _makeArrMarkOrMap(arr)
// export const define = (obj: object, key: string, val: any, enumerable?: boolean, writable?: boolean) => Object.defineProperty(obj, key, { value: val, enumerable: !!enumerable, writable: true, configurable: true })

/**
 * 常用函数包装函数
 */
export const once = (func: Function) => _before(2, func)
export const before = _before
export const after = _after
export const throttle = _throttle
export const debounce = _debounce
export const memoize = _memoize
export const spread = (callback: Function) => (arr: any[]) => callback.apply(null, arr)
export const wrapFn = (callback: any, context?: any) => isFunction(callback) ? callback.bind(context) : noop
export const nextTick = _makeNextTick()

/**
 * qs函数
 */
export const stringify = (obj: any, sep = '&', eq = '='): string => isString(obj) ? obj : _map(obj, (value, key) => key + eq + _encodePrimitive(value)).join(sep)
export const parse = _parse

/**
 * 时间相关
 */
export const now: () => number = Date.now
export const unixtime = (unixtime: number = now() / 1000, format?: string) => _formatTime(new Date(unixtime * 1000), format)
export const timestamp = (timestamp: number = now(), format?: string) => _formatTime(new Date(timestamp), format)
export const wait = <T>(duration: number, arg?: T): Promise<T> => new Promise(resolve => setTimeout(resolve, duration, arg))
export const timeago = _timeago

/**
 * 路径操作
 */
export const splitPath = (filename: string): string[] => (regexSplitPath.exec(filename) || []).slice(1)
export const resolvePath = _resolvePath
export const dirname = _dirname
export const basename = _basename
export const extname = _extname

function _tagTester(name: string) {
  const tag = '[object ' + name + ']';
  return <T>(obj: T): obj is T => toString.call(obj) === tag
}

function _shallowProperty (key: string) {
  return (obj: any) => obj == null ? void 0 : obj[key]
}

function _encodePrimitive(value: any) {
  if (!isDef(value)) return ''
  else if (isBoolean(value)) value = value ? 'true' : 'false'
  else if (isObject(value)) value = JSON.stringify(value)
  return encodeURIComponent(value)
}

function _isEmpty (val: any) {
  if (val == null || val === false) return true
  const len = getLength(val)
  if (isNumber(len) && (isArray(val) || isString(val) || isArguments(val))) {
    return len === 0
  }
  return getLength(keys(val)) === 0
}

function _map <T>(obj: T[], iteratee: (val: any, key: string | number, obj: T[]) => any) {
  var i: number, length: number, result: any[] = []
  if (isArray(obj) || isArguments(obj)) {
    for (i = 0, length = obj.length; i < length; i++) result.push(iteratee(obj[i], i, obj))
  } else {
    var ks = keys(obj)
    for (i = 0, length = ks.length; i < length; i++) result.push(iteratee(obj[ks[i]], ks[i], obj))
  }
  return result
}

function _shuffle <T>(array: T[]): T[] {
  for (var i = array.length - 1; i > 0; i--) {
    var j = random(i)
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

function _parse(qs: string, sep: string = '&', eq: string = '='): Record<string, any> {
  var obj: any = {}
  if (typeof qs !== 'string' || !qs) {
    return qs || obj
  }
  var regexp = /\+/g
  const qsSplit: string[] = qs.split(sep)
  var len = qsSplit.length
  for (var i = 0; i < len; ++i) {
    var x = qsSplit[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr: string, vstr: string, k: string, v: string

    if (idx >= 0) {
      kstr = x.substr(0, idx)
      vstr = x.substr(idx + 1)
    } else {
      kstr = x
      vstr = ''
    }
    k = decodeURIComponent(kstr)
    v = decodeURIComponent(vstr)
    if (!isHasOwn(obj, k)) {
      obj[k] = v
    } else if (isArray(obj[k])) {
      obj[k].push(v)
    } else {
      obj[k] = [obj[k], v]
    }
  }
  return obj
}

function _formatTime (date: Date, format = 'Y-m-d H:i:s') {
  const pad = (val: number) => val < 10 ? `0${val}` : val
  const rep = {
    Y: () => date.getFullYear(),
    M: () => date.getMonth() + 1,
    D: () => date.getDate(),
    h: () => date.getHours(),
    I: () => date.getMinutes(),
    S: () => date.getSeconds(),
    W: () => date.getDay(), // week
    v: () => date.getTime(), // miss
    y: () => rep.Y() % 100,
    m: () => pad(rep.M()),
    d: () => pad(rep.D()),
    H: () => pad(rep.h()),
    i: () => pad(rep.I()),
    s: () => pad(rep.S()),
    // am and pm
    a: () => rep.h() < 12 ? 'am' : 'pm',
    A: () => rep.a().toUpperCase(),
  }
  return format.replace(/(\\?)(.)/g, (_, esc, chr) => {
    return (esc === '' && rep[chr]) ? rep[chr]() : chr
  })
}

/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 */
function _throttle(func: Function, wait: number) {
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
function _debounce<T extends Function>(func: T, wait: number = 100, immediate: boolean = false): T {
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
 * 遍历对象或者数组
 */
function _each (obj: any, iteratee: (val: any, key: any, _this: unknown) => any, context?: any) {
  // 作用域绑定
  if (context) {
    iteratee = iteratee.bind(context)
  }
  let i: any, length: number
  if (isArray(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      if (iteratee(obj[i], i, obj) === false) return
    }
  } else {
    var keys = Object.keys(obj)
    for (i = 0, length = keys.length; i < length; i++) {
      if (iteratee(obj[keys[i]], keys[i], obj) === false) return
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
function _pick<T>(obj: T, map: string[] | Record<string, any>): T {
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
function _memoize<T>(func: Function, hashFn?: (...arg: any[]) => string): T {
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

function _uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    const r = Math.random() * 16 | 0; // eslint-disable-line
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
    return v.toString(16);
  })
}

function _randomstr(len: number = 8): string {
  let str = '', repeat = Math.ceil(len / 8)
  while (repeat--) {
    str += Math.random().toString(36).slice(2)
  }
  return str.slice(0, len).toUpperCase()
}

// @see https://github.com/lodash/lodash
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @exampe
 *
 * jQuery(element).on('click', before(5, addContactToList))
 * // => Allows adding up to 4 contacts to the list.
 */
function _before (n: number, func: Function | any) {
  let result: any
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  return function (this: any, ...args: any[]) {
    if (--n > 0) {
      result = func.apply(this, args)
    }
    if (n <= 1) {
      func = undefined
    }
    return result
  }
}

/**
 * The opposite of `before`. This method creates a function that invokes
 * `func` once it's called `n` or more times.
 *
 * @since 0.1.0
 * @category Function
 * @param {number} n The number of calls before `func` is invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * const saves = ['profile', 'settings']
 * const done = after(saves.length, () => console.log('done saving!'))
 *
 * forEach(saves, type => asyncSave({ 'type': type, 'complete': done }))
 * // => Logs 'done saving!' after the two async saves have completed.
 */
function _after(n: number, func: Function) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  n = n || 0
  return function (this: any, ...args: any[]) {
    if (--n < 1) {
      return func.apply(this, args)
    }
  }
}

/**
 * Removes all elements from `array` that `predicate` returns truthy for
 * and returns an array of the removed elements. The predicate is invoked
 * with three arguments: (value, index, array).
 *
 * **Note:** Unlike `filter`, this method mutates `array`. Use `pull`
 * to pull elements from an array by value.
 *
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new array of removed elements.
 * @see pull, pullAll, pullAllBy, pullAllWith, pullAt, reject, filter
 * @example
 *
 * const array = [1, 2, 3, 4]
 * const evens = remove(array, n => n % 2 == 0)
 */
function _remove<T>(array: T[], predicate: (value: unknown, index: number, array: T[]) => boolean): T[] {
  const result: T[] = []
  if (!(array != null && array.length)) {
    return result
  }
  let index = -1
  const indexes: number[] = []
  const { length } = array

  while (++index < length) {
    const value = array[index]
    if (predicate(value, index, array)) {
      result.push(value)
      indexes.push(index)
    }
  }
  // basePullAt(array, indexes)
  let newLength = array ? indexes.length : 0
  const lastIndex = length - 1

  while (newLength--) {
    let previous
    const index = indexes[newLength]
    if (newLength === lastIndex || index !== previous) {
      previous = index
      array.splice(index, 1)
    }
  }
  return result
}

// timeago
// build-in locales: en & zh_CN
const TimeagoMapZh = '秒_分钟_小时_天_周_月_年'.split('_')
// second, minute, hour, day, week, month, year(365 days)
const TimeSecArray = [60, 60, 24, 7, 365 / 7 / 12, 12]
const getTimeagoLang = function (number: number, index: number) {
  if (index === 0) return ['刚刚', '片刻后']
  const unit = TimeagoMapZh[Math.floor(index / 2)]
  return [number + unit + '前', number + unit + '后']
}

/**
 * 美化表示Unix时间戳，注意参数为时间戳
 * @param {number} unixTime 允许`Date`类型参数
 * @returns {string} 美化后的时间描述，如“3小时前”
 */
function _timeago (unixTime: Date | number): string {
  if (unixTime instanceof Date) unixTime = unixTime.getTime() / 1000
  let diff = Date.now() / 1000 - unixTime
  const agoin = diff < 0 ? 1 : 0 // timein or timeago
  const SEC_ARRAY_LEN = 6
  diff = Math.abs(diff)
  for (var i = 0; diff >= TimeSecArray[i] && i < SEC_ARRAY_LEN; i++) {
    diff /= TimeSecArray[i]
  }
  diff = Math.floor(diff)
  i *= 2
  if (diff > (i === 0 ? 9 : 1)) i += 1
  return getTimeagoLang(diff, i)[agoin].replace('%s', '' + diff)
}

// path

/**
 * 把一个路径或路径片段的序列解析为一个绝对路径
 * @param {string} to 初始路径
 * @param {string} from 相对路径
 */
function _resolvePath(...args: string[]): string {
  let resolvedPath = '',
    resolvedAbsolute = false;
  for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? args[i] : '/';
    if (!path) {
      continue;
    }
    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }
  resolvedPath = _normalizePathArray(_filterPath(resolvedPath.split('/'), p => !!p), !resolvedAbsolute).join('/')
  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

/**
 * 返回一个 path 的目录名，类似于 Unix 中的 dirname 命令。
 * @example
 * sdk.dirname('/foo/bar/baz/asdf/quux'); // 返回 /foo/bar/baz/asdf
 */
function _dirname(path: string): string {
  var [root, dir] = splitPath(path)
  // No dirname whatsoever
  if (!root && !dir) return '.'

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
}

/**
 * 返回一个 path 的最后一部分，类似于 Unix 中的 basename 命令
 * @example
 * sdk.basename('/foo/bar/quux.html'); // 返回 'quux.html'
 */
function _basename (path: string, ext?: string): string {
  var f = splitPath(path)[2];
  // make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}

/**
 * 回 path 的扩展名，即从 path 的最后一部分中的最后一个
 * @example
 * sdk.extname('index.html'); // 返回 .html
 * @param {string} path 
 */
function _extname(path: string): string {
  return splitPath(path)[3];
}

function _normalizePathArray(parts: any[], allowAboveRoot?: boolean) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

function _filterPath(xs: any[], f: any) {
  if (xs.filter) return xs.filter(f)
  var res: any[] = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}

function _filterURL (url: string, filters: string[]) {
  const [base, qstring] = url.split('?')
  if (!qstring) return url
  const query = parse(qstring)
  filters.forEach(filter => { if (isHasOwn(query, filter)) delete query[filter] })
  return createURL(base, query)
}

function _makeArrMarkOrMap(arr: string[], isMark?: boolean) {
  const mark = Object.create(null)
  if (!isArray(arr)) return mark
  arr.forEach(item => mark[item] = isMark ? true : item)
  return mark
}

function _classNames(...args: any[]) {
  var classes: any[] = []
  for (var i = 0; i < args.length; i++) {
    var arg = args[i]
    if (!arg) continue
    var argType = typeof arg
    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (isArray(arg)) {
      if (arg.length) {
        var inner = _classNames.apply(null, arg)
        if (inner) {
          classes.push(inner)
        }
      }
    } else if (argType === 'object') {
      if (arg.toString !== ObjProto.toString) {
        classes.push(arg.toString())
      } else {
        for (var key in arg) {
          if (isHasOwn(arg, key) && arg[key]) {
            classes.push(key)
          }
        }
      }
    }
  }
  return classes.join(' ')
}

const hyphenateStyleName: (prop: string) => string = memoize(dasherize)
/**
 * css样式编译，支持以下方式
 * styles('position: absoulte', { zIndex: 1, left: 2 }, [ 'zIndex', 1 ])
 * 如果值为空，将会被忽略，如下
 * styles(null, false, '', [], {})
 */
function _styles(...args: any[]) {
  const code: any[] = []
  for (let i = 0, len = args.length; i < len; i++) {
    const line = args[i]
    if (isEmpty(line)) continue
    if (isString(line) || isNumber(line)) code.push(line)
    else if (isArray(line)) {
      if (line.length !== 2) {
        console.warn(`不支持的css编译格式：${JSON.stringify(line)}`)
      }
      const value = _css(line[0], line[1])
      value && code.push(value)
    } else if (isObject(line)) {
      keys(line).forEach(prop => {
        const value = _css(prop, line[prop])
        value && code.push(value)
      })
    }
  }
  return code.join(';')
}

const _makeIgorePxSet = once(() => {
  const props = `animationIterationCount,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,stopOpacity,strokeDashoffset,strokeOpacity,strokeWidth`.split(',')
  for (let index = 0, len = props.length; index < len; index++) {
    const prop = props[index]
    const hyprop = hyphenateStyleName(prop)
    if (prop !== hyprop) {
      props.push(hyprop)
    }
  }
  return new Set(props)
})

function _css(prop: string, value: any) {
  if (!prop || value == null || value === '') {
    return ''
  }
  if (value && isNumeric(value) && !_makeIgorePxSet().has(prop)) {
    value = (+value) + 'px'
  }
  return `${hyphenateStyleName(prop)}:${value}`
}

function _equal (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    const isArrayA = isArray(a)
    const isArrayB = isArray(b)
    if (isArrayA && isArrayB) {
      return a.length === b.length && a.every((e: any, i: number) => {
        return _equal(e, b[i])
      })
    } else if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime()
    } else if (!isArrayA && !isArrayB) {
      const keysA = keys(a)
      const keysB = keys(b)
      return keysA.length === keysB.length && keysA.every(key => {
        return _equal(a[key], b[key])
      })
    } else {
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}


function _makeNextTick () {
  const callbacks: any[] = []
  let pending = false
  function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  return function _nextTick (callback?: any, ctx?: any) {
    let _resolve: any
    callbacks.push(() => {
      if (callback) {
        callback.call(ctx)
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      setTimeout(flushCallbacks, 0)
    }
    if (!callback) {
      return new Promise(resolve => { _resolve = resolve })
    }
  }
}
