import analysis, { IAnalysisProxy } from './analysis'
import { randomstr, once, now, isArray, isString } from '../functions/common'
import { addListener, domready } from '../functions/web'
import mlocation from './location.web'
import Auth from '../factory/Auth'

const SpmFromMap = {
  timeline: 'tx.wx.tl', // 朋友圈
  groupmessage: 'tx.wx.gm', // 群组消息
  singlemessage: 'tx.wx.sm', // 好友消息
  miniapp: 'tx.wx.mini', // 小程序
  qq: 'tx.wx.qq',
  weibo: 'tx.wx.weibo',
  qzone: 'tx.wx.qzone',
}

const $img = document.createElement('img')

const proxy: IAnalysisProxy= {
  install (analysis) {
    domready.then(() => analysis.pv())
    addListener(window, 'unload', () => analysis.unload())
    addListener(window, 'error', (e: any) => analysis.error(e.error))
  },
  ready: once(() => domready.then(() => Auth.instance && Auth.instance.tasker)),
  minVistedTime: 3000,
  minStayTime: 10000,
  requestId: randomstr(6),
  requestTime: now(),
  get pageurl () {
    return mlocation.rootpath
  },
  get userid () {
    return Auth.instance ? Auth.instance.id : 0
  },
  get useragent () {
    return navigator.userAgent
  },
  // 用户溯源探针
  get spm () {
    const query = mlocation.query
    let from = query.from || query.spm_from
    // 可能存在参数重复的问题 如：&spm_from=url&spm_from=timeline
    if (isArray(from)) {
      from = from.pop()
    }
    const uid = query.spm_uid || 0
    return { from: SpmFromMap[from] || from || 'url', uid }
  },
  unloadData: '',
  maxReportError: 3,
  // send
  sendRequest (src: string) {
    $img.src = src
  },
  getErrorStack (error: string | Error) {
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

export default analysis.use(proxy)
