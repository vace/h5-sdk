import { once, uid, each, isDef, global, isNumeric, isString, object, makeMark } from './common'

const { navigator, document } = <Window> global

export { document, navigator }

/**
 * 网页相关常量
 */

/** 当前的userAgent */
export const userAgent = navigator.userAgent

const ua = userAgent.toLowerCase()

/** 是否为移动设备 */
export const isMobile: boolean = /mobile/.test(ua)
/** 是否为ios设备（ipad产品或者iphone） */
export const isIos: boolean = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua)
/** 是否为安卓设备 */
export const isAndroid = /android/.test(ua)
/** 是否为小程序 */
export const isMiniapp = global['__wxjs_environment'] === 'miniprogram'
/** 是否在微信浏览器中 */
export const isWechat = /micromessenger/i.test(ua)
/** 是否在钉钉浏览器中 */
export const isDingTalk: boolean = /DingTalk/i.test(ua)

/**
 * 动画相关
 */

const cssVendors = { Webkit: 'webkit', Moz: '', O: 'o' }
const testVenderEl: any = document.createElement('div')
let transitionEventPrefix
let transitionPrefix = ''
const normalizeEvent = (name: string) => transitionEventPrefix ? transitionEventPrefix + name : name.toLowerCase()

if (!isDef(testVenderEl.style.transform)) {
  each(cssVendors, (vendor, event) => {
    if (isDef(testVenderEl.style[vendor + 'TransitionProperty'])) {
      transitionPrefix = '-' + vendor.toLowerCase() + '-'
      transitionEventPrefix = event
      return false
    }
  })
}

/** css animation的前缀 */
export const animationPrefix = transitionPrefix
/** css transitionEnd 事件 */
export const transitionEnd = normalizeEvent('TransitionEnd')
/** css animationEnd 事件 */
export const animationEnd = normalizeEvent('AnimationEnd')
/** 当前页面是否启用动画 */
export const animationEnabled = isDef(transitionEventPrefix) || isDef(testVenderEl.style.transitionProperty)

type removeEventListener = () => void

/** 监听指定元素的时间，返回unbind */
export function addListener(element: EventTarget, event: string, callback: EventListener): removeEventListener {
  element.addEventListener(event, callback, false)
  return () => element.removeEventListener(event, callback, false)
}

/** 监听动画结束事件 */
export function onAnimationEnd (element: HTMLElement, callback: EventListener) {
  return animationEnabled ? addListener(element, animationEnd, callback) : callback(new Event('disabled'))
}

/** 监听渐变动画结束事件 */
export function onTransitionEnd (element: HTMLElement, callback: EventListener) {
  return animationEnabled ? addListener(element, animationEnd, callback) : callback(new Event('disabled'))
}

const isReadyed = /comp|inter|loaded/.test(document.readyState)
/** 页面是否就绪 */
export const domready: Promise<boolean> = isReadyed ? Promise.resolve(true) : new Promise(resolve => addListener(document, 'DOMContentLoaded', () => resolve(true)))

/** 网页是否支持webp */
export const webp = once(() => new Promise(resolve => {
  var webP = document.createElement('img')
  webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA' + 'iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA'
  webP.onload = webP.onerror = () => webP.height === 2 ? resolve(true) : resolve(false)
}))

/** 发送jsonp请求 */
export const jsonp = _jsonp

/** 获取dom属性表，属性支持修饰符(!:转换为布尔值，+:转换为数值，?: 尝试转换数值) */
export const getDomAttrs = _getDomAttrs

interface IJsonpOption { callback?: string, timeout?: number}

function _jsonp(url: string, options: IJsonpOption | any = {}) {
  return new Promise((resolve, reject) => {
    const { callback = 'callback', timeout } = options
    const root = document.head || document.body
    const script = document.createElement('script')
    const name = uid('__sdkjsonp_')
    const timeId = timeout ? setTimeout(() => reject(new Error('jsonp timeout')), timeout) : null
    script.src = `${url}${/\?/.test(url) ? '&' : '?'}${callback}=${name}`
    global[name] = function (data: any) {
      root.removeChild(script)
      delete global[name]
      timeId !== null && clearTimeout(timeId)
      resolve(data)
    }
    // TODO ERROR HANDLE
    root.appendChild(script)
  })
}

const FalseString = makeMark(['false', 'off', 'disabled'])

function _getDomAttrs (element: string | Element, attrs: string[]): Record<string, any> {
  const dom = isString(element) ? document.querySelector(element) : element
  const cache = object()
  if (!dom) return cache
  for (let attr of attrs) {
    const firstTypeChar = attr[0]
    const isBoolean = firstTypeChar === '!'    // 转换为boolean，字符串时为false,off,disabled
    const isNumber = firstTypeChar === '+'     // 强制转换为数字，无法转换返回0
    const isAutoCovent = firstTypeChar === '?' // 尽可能转换为数字，不能转换原样返回
    if (isBoolean || isNumber || isAutoCovent) {
      attr = attr.slice(1)
    }
    let value: any = dom.getAttribute(attr)
    if (!isDef(value)) {
      continue
    }
    if (isBoolean) {
      value = !FalseString[value]
    } else if (isNumber) {
      value = parseFloat(value) || 0
    } else if (isAutoCovent) {
      if (isNumeric(value)) {
        value = parseFloat(value)
      }
    }
    cache[attr] = value
  }
  return cache
}
