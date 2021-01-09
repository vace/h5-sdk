import App from "../factory/App";
import Config from "../factory/Config";
import Auth from '../factory/Auth'
import { randomstr, now, isNumber, isString, wait, noop, version} from "../functions/common";
import { signature } from "./safety";

type IAnalysisConfig = {
  // 是否启用
  enabled: boolean
  // 当前请求id
  requestId: string
  // 当前请求时间
  requestTime: number
  // 最小访问统计时间
  minVistedTime: number
  // 最小停留统计时间
  minStayTime: number
  // 错误上报最大数量
  maxReportError: number
  // 页面卸载数据
  unloadData: any,
  // 当前用户ID
  userId: number
  // 当前页面url
  getURL(): void | string,
  // 来源信息 from: 渠道，uid: 渠道id
  getSpm(): { from: string, uid: number }
  // 当前设备agent
  getAgent(): void | string
  // 发送请求
  sendRequest: (url: string) => void,
  getErrorStack: (err: Error | string) => string
}

const config: IAnalysisConfig = {
  enabled: true,
  minVistedTime: 3000,
  minStayTime: 10000,
  requestId: randomstr(6),
  requestTime: now(),
  unloadData: '',
  maxReportError: 3,
  get userId() {
    return Auth.instance ? Auth.instance.id : 0
  },
  getURL: noop,
  getSpm: noop as any,
  getAgent: noop,
  sendRequest: noop,
  getErrorStack: err => err.toString()
}

const baseAnalysis = { config, send, pv, share, user, click, unload, error }

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

/** 发送指定事件 */
function send (event: string, data: any = '', value: number = 0) {
  const app = App.instance
  // 无应用，不发送数据
  if (!app || !app.appid || app.analysisoff || !config.enabled) {
    return null
  }
  
  if (!isString(data) && !isNumber(data)) {
    data = JSON.stringify(data)
  }
  // 提交的数据选项
  const option: any = {
    [ANA_APPID]: app.appid,
    [ANA_USER_AGENT]: config.getAgent(),
    [ANA_PAGE_URL]: config.getURL(),
    [ANA_USER_ID]: config.userId,
    [ANA_SDK_VERSION]: version,
    [ANA_EVENT_NAME]: event,
    [ANA_SEND_DATA]: data,
    [ANA_SEND_VALUE]: Math.round(value || 0),
    [ANA_REQEST_ID]: config.requestId,
    [ANA_REQEST_NONCE]: randomstr(16)
  }
  option[ANA_REQEST_SIGNATURE] = signature(option)
  //! 注意：此参数用于去除跨域请求，不参与签名
  option.cros = 'off'
  return config.sendRequest(Config.service('analysis/log', option))
}

/** 发送页面pv事件 */
function pv () {
  const spm = config.getSpm()
  const stayTime = now() - config.requestTime
  const afterSend = Math.max(config.minVistedTime - stayTime, 0)
  return wait(afterSend).then(() => send(EVENT_VIEW, spm.from, spm.uid))
}

/** 发送用户事件 */
function user(data?: any, value?: number) {
  return send(EVENT_USER, data, value)
}

/** 发送用户分享事件 */
function share(platform?: any, logid?: number) {
  return send(EVENT_SHARE, platform, logid)
}

/** 发送用户点击事件 */
function click(data?: any, value?: number) {
  return send(EVENT_CLICK, data, value)
}

/** 发送用户离开事件 */
function unload () {
  const stayTime = (now() - config.requestTime) / 1000
  // 最小访问时间限制
  if (stayTime < config.minStayTime) {
    return
  }
  return send(EVENT_UNLOAD, config.unloadData, stayTime)
}

let _errorReportHistory: string[] = []

/** 发送错误事件 */
function error (error: Error | string) {
  // 已经达到最大上报次数
  if (!error || _errorReportHistory.length >= config.maxReportError) {
    return false
  }
  let errorStack = config.getErrorStack(error)
  // 错误已经上报一次了
  if (!errorStack || _errorReportHistory.indexOf(errorStack) !== -1) {
    return // ignore
  }
  const errCount = _errorReportHistory.push(errorStack)
  return send(EVENT_ERROR, errorStack, errCount)
}
