/**
 * 小程序函数集合
 */
import { once } from './common'

declare var wx: any
declare var getCurrentPages: any

const { miniProgram } = wx.getAccountInfoSync()

/** 小程序appid */
export const appid: string = miniProgram.appId

/** 是否为调试模式 */
export const isDev: boolean = miniProgram.envVersion === 'develop'

// 读取auth setting
export const getAuthSetting = (scope: string) => new Promise((resolve, reject) => wx.getSetting().then(({ authSetting }) => resolve(authSetting[`scope.${scope}`])).catch(err => {throw new WxError(err)}))

// 可缓存的读取系统信息
export const getSystemInfoSync = once(() => wx.getSystemInfoSync())

// @see https://github.com/youzan/vant-weapp/pull/3498/commits/df6fedfc39918855a2e96932bda4f623f540b615
export function requestAnimationFrame(cb: Function) {
  const systemInfo = getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return setTimeout(cb, 1000 / 30)
  }
  return wx.createSelectorQuery().selectViewport().boundingClientRect().exec(() => cb())
}

// 读取当前页面
export function getCurrentPage() {
  var pages = getCurrentPages();
  return pages[pages.length - 1]
}

export const getOffscreenCanvas = once(() => {
  return wx.createOffscreenCanvas()
})

export class WxError extends Error {
  public reason: any
  constructor (err: any) {
    const message = err && err.errMsg || err.message || 'wx api error'
    super(message)
    this.reason = err
  }
}
