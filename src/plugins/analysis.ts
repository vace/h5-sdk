import App from "../factory/App";
import Config from "../factory/Config";
import { randomstr, now, isNumber, isString, wait, isFunction } from "../functions/common";
import { signature } from "./safety";

export interface IAnalysisProxy {
  installed?: boolean
  // 事件安装与监听
  install: (base: typeof baseAnalysis) => any
  // 页面就绪
  ready: () => Promise<any>,
  // 最小访问统计时间
  minVistedTime: number
  // 最小停留统计时间
  minStayTime: number
  // 错误上报最大数量
  maxReportError: number
  // 当前请求id
  readonly requestId: string
  // 当前请求时间
  readonly requestTime: number
  // 当前url
  readonly pageurl: string
  // 当前用户ID
  readonly userid: number
  // 当前设备agent
  readonly useragent: string
  // 页面卸载数据
  unloadData: any
  // 来源信息 from: 渠道，uid: 渠道id
  spm: { from: string, uid: number }
  // 发送请求
  sendRequest: (url: string) => void,
  getErrorStack: (err: Error | string) => string
}

let analysis: IAnalysisProxy
const baseAnalysis = { use, send, pv, share, user, click, unload, error }
export default baseAnalysis

/** 事件集合 */
const EVENT_VIEW = 'VIEW'
const EVENT_ERROR = 'ERROR'
const EVENT_SHARE = 'SHARE'
const EVENT_UNLOAD = 'UNLOAD'
const EVENT_CLICK = 'CLICK'
const EVENT_USER = 'USER'

/** 参数map */
const ANA_APPID = 'ai' // 应用appid
const ANA_USER_AGENT = 'ua' // 应用UA
const ANA_PAGE_URL = 'ul' // 应用URL
const ANA_USER_ID = 'ui' // 用户ID
const ANA_EVENT_NAME = 'ev' // 应用事件
const ANA_SEND_DATA = 'sd' // 发送数据
const ANA_SEND_VALUE = 'vl' // 发送值（必须为数字）
const ANA_SDK_VERSION = 'vr' // 版本号
const ANA_REQEST_ID = '_i' // 请求ID
const ANA_REQEST_NONCE = '_n' // 随机数
const ANA_REQEST_SIGNATURE = '_s' // 此次请求签名

function use (proxy: IAnalysisProxy) {
  analysis = proxy
  if (!proxy.installed) {
    proxy.installed = true
    proxy.install(baseAnalysis)
  }
  return baseAnalysis
}

function send (event: string, data: any = '', value: number = 0) {
  const app = App.instance
  // 无应用，不发送数据
  if (!app || !app.appid || app.analysisoff) {
    return null
  }
  
  if (!isString(data) && !isNumber(data)) {
    data = JSON.stringify(data)
  }
  // 提交的数据选项
  const option: any = {
    [ANA_APPID]: app.appid,
    [ANA_USER_AGENT]: analysis.useragent,
    [ANA_PAGE_URL]: analysis.pageurl,
    [ANA_USER_ID]: analysis.userid,
    [ANA_SDK_VERSION]: '__VERSION__',
    [ANA_EVENT_NAME]: event,
    [ANA_SEND_DATA]: data,
    [ANA_SEND_VALUE]: Math.round(value || 0),
    [ANA_REQEST_ID]: analysis.requestId,
    [ANA_REQEST_NONCE]: randomstr(16)
  }
  option[ANA_REQEST_SIGNATURE] = signature(option)
  //! 注意：此参数用于去除跨域请求，不参与签名
  option.cros = 'off'
  return analysis.sendRequest(Config.service('analysis/log', option))
}

function pv () {
  const spm = analysis.spm
  const stayTime = now() - analysis.requestTime
  const afterSend = Math.max(analysis.minVistedTime - stayTime, 0)
  return wait(afterSend).then(() => send(EVENT_VIEW, spm.from, spm.uid))
}

function user(data?: any, value?: number) {
  return send(EVENT_USER, data, value)
}

function share(platform?: any, logid?: number) {
  return send(EVENT_SHARE, platform, logid)
}

function click(data?: any, value?: number) {
  return send(EVENT_CLICK, data, value)
}

function unload () {
  const stayTime = (now() - analysis.requestTime) / 1000
  // 最小访问时间限制
  if (stayTime < analysis.minStayTime) {
    return
  }
  return send(EVENT_UNLOAD, analysis.unloadData, stayTime)
}

let _errorReportHistory: string[] = []
/**
 * 发送错误事件
 * @param {Error} error
 */
function error (error: Error | string) {
  // 已经达到最大上报次数
  if (!error || _errorReportHistory.length >= analysis.maxReportError) {
    return false
  }
  let errorStack = analysis.getErrorStack(error)
  // 错误已经上报一次了
  if (!errorStack || _errorReportHistory.indexOf(errorStack) !== -1) {
    return // ignore
  }
  const errCount = _errorReportHistory.push(errorStack)
  return send(EVENT_ERROR, errorStack, errCount)
}
