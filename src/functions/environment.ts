/**
 * @module sdk
 */

const ua = navigator.userAgent.toLowerCase()

/** 是否为移动设备 */
export const isMobile: boolean = !!ua.match(/mobile/)

/** 是否为ios设备（ipad产品或者iphone） */
export const isIos: boolean = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i)

/** 是否为安卓设备 */
export const isAndroid = -1 !== ua.indexOf('android')

/** 是否为小程序 */
export const isMiniapp = window['__wxjs_environment'] === 'miniprogram'

/** 是否在微信浏览器中 */
export const isWechat = -1 !== ua.indexOf('micromessenger')

let WEBP_SUPPORT_PROMISE: any
/**
 * 检测当前环境是否支持解析webp格式图片
 * @returns {Promise<boolean>}
 */
export function checkSupportWebp(): Promise<boolean> {
  if (!WEBP_SUPPORT_PROMISE) {
    WEBP_SUPPORT_PROMISE = new Promise((resolve, reject) => {
      var webP = document.createElement('img')
      webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wA' + 'iMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA'
      webP.onload = webP.onerror = function () {
        let WEBP_SUPPORT_FLAG = webP.height === 2
        WEBP_SUPPORT_FLAG ? resolve() : reject()
      }
    })
  }
  return WEBP_SUPPORT_PROMISE
}