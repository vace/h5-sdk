/**
 * @module sdk
 */

import { regexHttp, regexBase64 } from './regex'

/** 预判目标是否为指定类型，根据toString判断 */
export function is (type: string): (arg: any) => arg is any {
  return function typeIs (arg: any): arg is any {
    return Object.prototype.toString.call(arg).toLowerCase() === `[object ${type}]`.toLowerCase()
  }
}
// (type: string) => (val: any) => Object.prototype.toString.call(val).toLowerCase() === `[object ${type}]`.toLowerCase()

/** 判断目标值类型是否为数组 */
export const isArray = Array.isArray || is('Array')

/** 判断目标值类型是否为布尔值 */
export const isBoolean = is('Boolean')

/** 判断目标值类型是否为null */
export const isNull = is('null')

/** 判断目标值类型是否为null 或者 undefined */
export const isNullOrUndefined = (arg: any) => arg == null

/** 判断目标值类型是否为number */
export const isNumber = is('number')

/** 判断目标值类型是否为string */
export const isString = is('string')

/** 判断目标值类型是否为symbol */
export const isSymbol = is('symbol')

/** 判断目标值类型是否为undefined */
export const isUndefined = is('undefined')

/** 判断目标值类型是否为正则表达式 */
export const isRegExp = is('regexp')

/** 判断目标值类型是否为对象，排除null */
export const isObject = (arg: any) => typeof arg === 'object' && arg !== null

/** 判断目标值类型是否为Date */
export const isDate = is('date')

const _typeError = is('error')

/** 判断目标值类型是否为Error */
export const isError = (e: any) => (isObject(e) && _typeError(e)) || e instanceof Error

/** 判断目标值类型是否为Function */
export const isFunction = is('function')

/** 判断目标值类型是否为Primitive，包含（boolean,number,string,symbol,undefiend,null） */
export function isPrimitive(arg: any): boolean {
  return arg === null ||
    typeof arg === 'boolean' ||
    typeof arg === 'number' ||
    typeof arg === 'string' ||
    typeof arg === 'symbol' ||  // ES6 symbol
    typeof arg === 'undefined'
}

/** hasOwnProperty的快速写法 */
export function isHasOwn (obj: any, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

/** 值是否为空，空值为 null, undefined, false, '', [] */
export function isEmpty (value: any): boolean {
  return isNullOrUndefined(value) || value === false || value === '' || (isArray(value) && !value.length)
}

/** 判断一个string是否为有效的http链接 */
export function isHttp (str: string): boolean {
  return regexHttp.test(str)
}

/** 判断字符串是否为base64格式 */
export function isBase64 (string: string): boolean {
  return isString(string) && regexBase64.test(string)
}

/** 是否为原生类，用于判断一些原生的属性，如 isNative(window.fetch) */
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

/** 检测对象是否为window */
export function isWindow (obj: any): boolean {
  return obj != null && obj == obj.window
}

/** 检测对象是否为Document */
export function isDocument (obj: any): boolean {
  return obj != null && obj.nodeType == obj.DOCUMENT_NODE && !isNullOrUndefined(obj.nodeType)
}


/** 检测是否为Promise对象 */
export function isPromise(obj: any): boolean {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

/** 检测是否为formdata对象 */
export function isFormData(val: any): boolean {
  return (typeof FormData !== 'undefined') && (val instanceof FormData)
}

/** 检测是否为File对象 */
export const isFile = is('file')

/** 检测是否为Bolb对象 */
export const isBlob = is('blob')
