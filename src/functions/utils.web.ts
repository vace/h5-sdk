import { once, uid, each, isDef } from './common'

const { navigator, document } = window

export { document, navigator }

/**
 * 网页相关常量
 */

const ua = navigator.userAgent.toLowerCase()

/** 是否为移动设备 */
export const isMobile: boolean = /mobile/.test(ua)
/** 是否为ios设备（ipad产品或者iphone） */
export const isIos: boolean = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua)
/** 是否为安卓设备 */
export const isAndroid = /android/.test(ua)
/** 是否为小程序 */
export const isMiniapp = window['__wxjs_environment'] === 'miniprogram'
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

export const animationPrefix = transitionPrefix
export const transitionEnd = normalizeEvent('TransitionEnd')
export const animationEnd = normalizeEvent('AnimationEnd')
export const animationEnabled = isDef(transitionEventPrefix) || isDef(testVenderEl.style.transitionProperty)

/** 监听事件 */
export function addListener(element: any, event: string, callback: EventListener): Function {
  element.addEventListener(event, callback, false)
  return () => element.removeEventListener(event, callback, false)
}

export function onAnimationEnd (element: HTMLElement, callback: EventListener) {
  return animationEnabled ? addListener(element, animationEnd, callback) : callback(new Event('disabled'))
}

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

export const jsonp = _jsonp

interface IJsonpOption { callback?: string, timeout?: number}

function _jsonp(url: string, options: IJsonpOption | any = {}) {
  return new Promise((resolve, reject) => {
    const { callback = 'callback', timeout } = options
    const root = document.head || document.body
    const script = document.createElement('script')
    const name = uid('__sdkjsonp_')
    const timeId = timeout ? setTimeout(() => reject(new Error('jsonp timeout')), timeout) : null
    script.src = `${url}${/\?/.test(url) ? '&' : '?'}${callback}=${name}`
    window[name] = function (data: any) {
      root.removeChild(script)
      delete window[name]
      timeId !== null && clearTimeout(timeId)
      resolve(data)
    }
    // TODO ERROR HANDLE
    root.appendChild(script)
  })
}
