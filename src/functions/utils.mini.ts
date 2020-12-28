/**
 * 小程序函数集合
 */

declare var wx: any
declare var getCurrentPages: any

const { miniProgram } = wx.getAccountInfoSync()

/** 小程序appid */
export const appid: string = miniProgram.appId

/** 是否为调试模式 */
export const isDev: boolean = miniProgram.envVersion === 'develop'

// 读取auth setting
export const getAuthSetting = async (scope: string) => {
  const { authSetting } = await wx.getSetting()
  return authSetting[`scope.${scope}`]
}

let systemInfo
// 可缓存的读取系统信息
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = wx.getSystemInfoSync()
  }
  return systemInfo;
}

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
