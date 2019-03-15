/**
 * @module sdk
 */

import { regexHttp, regexBase64 } from './regex'

/**
 * 预判目标是否为指定类型，根据toString判断
 * @param {string} type
 * @returns {boolean}
 */
export const is = function (type: string) {
  return function typeIs <T>(val: T): boolean {
    return Object.prototype.toString.call(val).toLowerCase() === `[object ${type}]`.toLowerCase()
  }
}
// (type: string) => (val: any) => Object.prototype.toString.call(val).toLowerCase() === `[object ${type}]`.toLowerCase()
/**
 * 判断目标值类型是否为数组
 * @param {any} arr
 * @returns {boolean}
 */
export const isArray = is('Array')

/**
 * 判断目标值类型是否为布尔值
 * @param {any} arg
 * @returns {boolean}
 */
export const isBoolean = is('Boolean')

/**
 * 判断目标值类型是否为null
 * @param {any} arg
 * @returns {boolean}
 */
export const isNull = is('null')

/**
 * 判断目标值类型是否为null 或者 undefined
 * @param {any} arg
 * @returns {boolean}
 */
export const isNullOrUndefined = (arg: any) => arg == null

/**
 * 判断目标值类型是否为number
 * @param {any} arg
 * @returns {boolean}
 */
export const isNumber = is('number')
/**
 * 判断目标值类型是否为string
 * @param {any} arg
 * @returns {boolean}
 */
export const isString = is('string')

/**
 * 判断目标值类型是否为symbol
 * @param {any} arg
 * @returns {boolean}
 */
export const isSymbol = is('symbol')

/**
 * 判断目标值类型是否为undefined
 * @param {any} arg
 * @returns {boolean}
 */
export const isUndefined = is('undefined')

/**
 * 判断目标值类型是否为正则表达式
 * @param {any} arg
 * @returns {boolean}
 */
export const isRegExp = is('regexp')

/**
 * 判断目标值类型是否为对象，排除null
 * @param {any} arg
 * @returns {boolean}
 */
export const isObject = (arg: any) => typeof arg === 'object' && arg !== null

/**
 * 判断目标值类型是否为Date
 * @param {any} arg
 * @returns {boolean}
 */
export const isDate = is('date')

const _typeError = is('error')
/**
 * 判断目标值类型是否为Error
 * @param {any} arg
 * @returns {boolean}
 */
export const isError = (e: any) => (isObject(e) && _typeError(e)) || e instanceof Error

/**
 * 判断目标值类型是否为Function
 * @param {any} arg
 * @returns {boolean}
 */
export const isFunction = is('function')

/**
 * 判断目标值类型是否为Primitive，包含（boolean,number,string,symbol,undefiend,null）
 * @param {any} arg
 * @returns {boolean}
 */
export function isPrimitive(arg: any) {
  return arg === null ||
    typeof arg === 'boolean' ||
    typeof arg === 'number' ||
    typeof arg === 'string' ||
    typeof arg === 'symbol' ||  // ES6 symbol
    typeof arg === 'undefined'
}

/**
 * hasOwnProperty的快速写法
 * @param {any} obj 目标对象
 * @param {string} prop 属性键名
 * @returns {boolean}
 */
export function isHasOwn (obj: any, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

/**
 * 值是否为空，空值为 null, undefined, false, '', []
 * @param {any} value 
 * @returns {boolean}
 */
export function isEmpty (value: any) {
  return isNullOrUndefined(value) || value === false || (isString(value) && value === '') || (isArray(value) && !value.length)
}

/**
 * 判断一个string是否为有效的http链接
 * @param {string} str 待检测文本
 * @returns {boolean}
 */
export function isHttp (str: string) {
  return regexHttp.test(str)
}
/**
 * 判断字符串是否为base64格式
 * @param {string} string 
 * @returns {boolean}
 */
export function isBase64 (string: string) {
  return isString(string) && regexBase64.test(string)
}

/**
 * 是否为原生类，用于判断一些原生的属性，如 isNative(window.fetch)
 * @param {any} Ctor 
 * @returns {boolean}
 */
export function isNative (Ctor: any) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

/**
 * 检测对象是否为window
 * @param {any} obj 等待检测对象
 * @returns {boolean}
 */
export function isWindow (obj: any) {
  return obj != null && obj == obj.window
}

/**
 * 检测对象是否为Document
 * @param {any} obj 等待检测对象
 * @returns {boolean}
 */
export function isDocument (obj: any) {
  return obj != null && obj.nodeType == obj.DOCUMENT_NODE
}


/**
 * 检测是否为Promise对象
 * @returns {boolean} 是否为promise
 */
export function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

/**
 * 检测是否为formdata对象
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
export function isFormData(val: any) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

/**
 * 检测是否为File对象
 * @param {Object} val The value to test
 * @returns {boolean} 
 */
export const isFile = is('file')

/**
 * 检测是否为Bolb对象
 * @param {Object} val The value to test
 * @returns {boolean} 
 */
export const isBlob = is('blob')
