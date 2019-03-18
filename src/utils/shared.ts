import { $ } from '../venders/zepto'
import { isNullOrUndefined } from '../functions/is';
import { regexNumber } from '../functions/regex';
import { CommonResponseData } from '../factory/Http';
import { dirname, resolvePath } from '../functions/path';
import { location } from './global';

// 默认的z-index
let GLOBAL_ZINDEX = 1e5

/**
 * 获取下一个zindex，从10000开始
 * @ignore
 * @returns {number}
 */
export function nextZIndex(): number {
  return GLOBAL_ZINDEX++
}

/**
 * 补全class前缀
 * @ignore
 * @param {(string | any[])} className
 * @returns {string}
 */
export function classPrefix (className: string | any[]): string {
  if (Array.isArray(className)) {
    return className.filter(cn => !!cn).map(cn => `_sdk-${cn}`).join(' ')
  }
  return `_sdk-${className}`
}

/**
 * 创建内置图标
 * @ignore
 * @param {string} name
 * @returns {string}
 */
export function createSdkIcon (name: string): string {
  return `<i class="_sdkfont _sf-${name}"></i>`
}

/**
 * 创建内置的zepto元素实例
 * @ignore
 * @param {string} className
 * @param {(string | ZeptoCollection)} [content]
 * @param {string} [tagName='div']
 * @returns {ZeptoCollection}
 */
export function createClsElement (
  className: string,
  content?: string | ZeptoCollection,
  tagName: string = 'div'
): ZeptoCollection{
  return $(`<${tagName}>`).addClass(classPrefix(className)).append(content)
}

/**
 * 监听动画完成事件
 * @ignore
 * @param $element
 * @param callback 
 */
export function onceAnimationEnd($element: ZeptoCollection, callback: any): any {
  const { off } = $.fx
  // 不支持动画时直接返回执行结果
  if (off) {
    return callback()
  } else {
    // zepto.one bind once event
    // fixed andioid 4.4 存在bug，无法触发animationend
    return $element.one('webkitAnimationEnd animationend', callback)
  }
}

/**
 * 读取获取元素的配置属性
 * ! 布尔值，+ 数字，? 如果有可能，转换为数字
 * @ignore
 * @param {HTMLElement} element 元素
 * @param {string[]} attrs 属性表
 */
export function getElementAttrs (element: HTMLElement | ZeptoCollection, attrs: string[]): {[key: string]: any} {
  const options = {}
  const isHtmlElemnt = element instanceof HTMLElement
  for (let attr of attrs) {
    const firstTypeChar = attr[0]
    const isBoolean = firstTypeChar === '!'
    const isNumber = firstTypeChar === '+'
    const isAutoCovent = firstTypeChar === '?'
    if (isBoolean || isNumber || isAutoCovent) attr = attr.slice(1)
    let value: any = isHtmlElemnt ? (element as any).getAttribute(attr) : (element as any).attr(attr)
    if (isNullOrUndefined(value)) {
      continue
    }
    if (isBoolean) {
      value = value !== 'false'
    } else if (isNumber) {
      value = parseFloat(value)
    } else if (isAutoCovent) {
      if (regexNumber.test(value)) {
        value = parseFloat(value)
      }
    }
    options[attr] = value
  }
  return options
}

/**
 * 通用http错误处理
 * @ignore
 * @param {CommonResponseData} response
 * @returns {Promise<Error> | Promise<any>}
 */
export function commonResponseReslove (response: CommonResponseData): Promise<Error> | Promise<any> {
  if (!response) {
    return Promise.reject(new Error('response data empty'))
  }
  const { code, data, message, msg } = response
  if (code) {
    const error = new Error(message || msg)
    error['code'] = code
    error['data'] = data
    return Promise.reject(error)
  }
  return Promise.resolve(data)
}

/**
 * Object.assign别名
 * @ignore
 */
export const assign = Object.assign

/**
 * 获取当前路径
 * @ignore
 */
export function getCurrentHref (): string {
  return <string>location.href.split('#').shift()
}

/**
 * 获取当前目录下文件
 * @ignore
 */
export function getCurrentPathFile(filename: string = ''): string {
  return dirname(<string>location.href.split('?').shift()) + '/' + filename
}
