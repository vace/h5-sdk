import analysis from './analysis'
import { isArray, isString, assign, global } from '../functions/common'
import { addListener, domready } from '../functions/utils.web'
import mlocation from './location.web'
import Auth from '../factory/Auth'

const $img = document.createElement('img')

const SpmFromMap = {
  timeline: 'tx.wx.tl', // 朋友圈
  groupmessage: 'tx.wx.gm', // 群组消息
  singlemessage: 'tx.wx.sm', // 好友消息
  miniapp: 'tx.wx.mini', // 小程序
  qq: 'tx.wx.qq',
  weibo: 'tx.wx.weibo',
  qzone: 'tx.wx.qzone',
}

const webConfig = {
  getURL () {
    return mlocation.rootpath
  },
  getAgent () {
    return navigator.userAgent
  },
  // 用户溯源探针
  getSpm() {
    const query = mlocation.query
    let from = query.from || query.spm_from
    // 可能存在参数重复的问题 如：&spm_from=url&spm_from=timeline
    if (isArray(from)) {
      from = from.pop()
    }
    const uid = query.spm_uid || 0
    return { from: SpmFromMap[from] || from || 'url', uid }
  },
  // send
  sendRequest(src: string) {
    $img.src = src
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

assign(analysis.config, webConfig)

// 页面就绪 & 用户登录后 开始发送分析数据
domready.then(() => Auth.instance && Auth.instance.tasker).then(() => {
  addListener(global, 'unload', () => analysis.unload())
  addListener(global, 'error', (e: any) => analysis.error(e.error))
  analysis.pv()
})

export default analysis
