import { $ } from '../venders/zepto'
import { isNullOrUndefined } from '../functions/is';
import { regexNumber } from '../functions/regex';
import { CommonResponseData } from '../factory/Http';
import { dirname, resolvePath } from '../functions/path';
import { location } from './global';

// 默认的z-index
let GLOBAL_ZINDEX = 1e5
export function nextZIndex() {
  return GLOBAL_ZINDEX++
}

export function classPrefix (className: string | any[]) {
  if (Array.isArray(className)) {
    return className.filter(cn => !!cn).map(cn => `_sdk-${cn}`).join(' ')
  }
  return `_sdk-${className}`
}

export function createSdkIcon (name) {
  return `<i class="_sdkfont _sf-${name}"></i>`
}

// helper function
export const createClsElement = (
  className: string,
  content?: string | ZeptoCollection,
  tagName: string = 'div'
): ZeptoCollection => $(`<${tagName}>`).addClass(classPrefix(className)).append(content)

/**
 * 监听动画完成事件
 * @param $element 
 * @param callback 
 */
export function onceAnimationEnd($element: ZeptoCollection, callback: any) {
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
 * @export
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

// 通用错误处理
export function commonResponseReslove (response: CommonResponseData) {
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

export const assign = Object.assign

export function getCurrentHref (): string {
  return <string>location.href.split('#').shift()
}

export function getCurrentPathFile(filename: string = ''): string {
  return dirname(<string>location.href.split('?').shift()) + '/' + filename
}
