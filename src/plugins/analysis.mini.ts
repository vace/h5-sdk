import { config, error, pv } from './analysis'
import { isArray, isString, assign, parse } from '../functions/common'
import { getCurrentPage, getSystemInfoSync } from '../functions/utils.mini'
export * from './analysis'

declare var wx: any

const webConfig = {
  // 小程序自带数据统计和分析，默认关闭
  enabled: false,
  query: '',
  getURL() {
    const page = getCurrentPage()
    return page.route || ''
  },
  getAgent() {
    const { SDKVersion, model, system, language } = getSystemInfoSync()
    return `Wechatmini/${SDKVersion} (${model}; ${system}) Language/${language}`
  },
  // 用户溯源探针
  getSpm() {
    const query = parse(webConfig.query)
    let from = query.from || query.spm_from || 'url'
    if (isArray(from)) {
      from = from.pop()
    }
    const uid = query.spm_uid || 0
    return { from, uid }
  },
  // send
  sendRequest(src: string) {
    wx.request({ url: src })
  },
  getErrorStack(error: string | Error) {
    if (isString(error) || !(error instanceof Error)) {
      return String(error)
    }
    let errorStack: string
    if (error.stack) {
      errorStack = error.stack.split('\n').slice(0, 3).join('\n')
    } else {
      errorStack = error.name + ': ' + error.message
    }
    return errorStack
  }
}

assign(config, webConfig)

// 页面就绪 & 用户登录后 开始发送分析数据
wx.onError((err: any) => error(err))
wx.onAppShow((res: any) => {
  webConfig.query = res.query
  pv()
})
