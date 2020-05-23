import { assign } from 'es6-object-assign'
import App from "../factory/App";
import { randomstr } from "../functions/common";
import { now } from "../functions/underscore";
import { stringify } from '../functions/qs'
import { getServiceUri } from "../config";
import _config from "../config";
import { signature } from "./safety";
import { analysis } from '../adapters/analysis/index'
import { isArray } from '../functions/is';

/** 分析参数 */
export type AnalysisOption = {
  /** 此函数返回真表示禁用 */
  disabled: boolean
  /** 错误最大上报次数 */
  maxReportError: number
  /** 统计开始时间，默认为当前脚本执行时间 */
  beforeLoadTime: number
  /** unload 时传递到统计脚本的数据 */
  unloadData: any
}

/** 默认配置 */
export const config: AnalysisOption = assign({
  disabled: false,
  maxReportError: 3,
  beforeLoadTime: now(),
  unloadData: ''
}, _config.analysis)

/** 事件集合 */
const EVENT_VIEW = 'VIEW'
const EVENT_ERROR = 'ERROR'
export const EVENT_SHARE = 'SHARE'
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

let _isStartFlag: boolean = false
let unBindEventList: any[] = []

/* 开始记录 */
export function start () {
  if (_isStartFlag) {
    return
  }
  _isStartFlag = true
  // 报错处理与上报
  const unbindShow = analysis.onShow(pv)
  const unbindError = analysis.onError((err: any) => error(err))
  const unbindUnload = analysis.onUnload((e: any) => {
    // 计算页面停留时长，只计算时长大于10s的记录
    const stayTime = (now() - config.beforeLoadTime) / 1000
    if (stayTime >= 10) {
      return event(EVENT_UNLOAD, config.unloadData, stayTime)
    }
  })
  unBindEventList = [
    unbindShow,
    unbindError,
    unbindUnload
  ]
}

/** 停止自动记录 */
export function stop () {
  if (!_isStartFlag) {
    return
  }
  _isStartFlag = false
  // 依次执行事件解绑函数
  unBindEventList.forEach(unbind => {
    if (typeof unbind === 'function') {
      unbind()
    }
  })
}


/** 请求ID */
const CurrentRequestId = randomstr(6)

/**
 * 发送指定事件
 * @param {string} event 事件名称
 * @param {string} [data=''] 事件数据
 * @param {number} [value=0] 事件数值
 */
function send (event: string, data: string = '', value: number = 0): Promise<void> | null {
  // 如果没有查询到应用，则不统计数据
  if (!App.hasInstance) {
    return null
  }
  const app = App.instance
  // 无应用，不发送数据
  if (!app || !app.appid || app.analysisoff || config.disabled) {
    return null
  }
  // 等待应用初始化完成
  return app.ready(() => {
    const userId = app.auth && app.auth.id || 0
    // 提交的数据选项
    const option: any = {
      [ANA_APPID]: app.appid,
      [ANA_USER_AGENT]: analysis.getUserAgent(),
      [ANA_PAGE_URL]: analysis.getCurrentUrl(true),
      [ANA_USER_ID]: userId,
      [ANA_SDK_VERSION]: '__VERSION__',
      [ANA_EVENT_NAME]: event,
      [ANA_SEND_DATA]: data,
      [ANA_SEND_VALUE]: Math.round(value || 0),
      [ANA_REQEST_ID]: CurrentRequestId,
      [ANA_REQEST_NONCE]: randomstr(16)
    }
    option[ANA_REQEST_SIGNATURE] = signature(option)
    //! 注意：此参数用于去除跨域请求，不参与签名
    option.cros = 'off'
    const log = getServiceUri('analysis/log') + '?' + stringify(option)
    return analysis.send(log)
  })
}

/**
 * 发送PV记录，记录用户UA、来源记录
 * 根据页面 from 或者 ADTAG 参数统计来源
 * 如：page.html?spm_from=ali.taobao.browser
 */
export function pv (e?: any) {
  const params: any = analysis.getCurrentParam()
  // 来源类型判断，from为微信端使用，spm_from为小程序或用户自定义
  let spmFrom = params.from || params.spm_from
  // 可能存在参数重复的问题 如：&spm_from=url&spm_from=timeline
  if (isArray(spmFrom)) {
    spmFrom = spmFrom.pop()
  }
  // 来源用户绑定（e && e.scene 小程序切前台的场景值）
  const spmUid = params.spm_uid || (e && e.scene) || 0
  const defaultTags: any = {
    timeline: 'tx.wx.tl', // 朋友圈
    groupmessage: 'tx.wx.gm', // 群组消息
    singlemessage: 'tx.wx.sm', // 好友消息
    miniapp: 'tx.wx.mini', // 小程序
  }
  return send('VIEW', defaultTags[spmFrom] || spmFrom || 'url', spmUid)
}

/**
 * 发送自定义事件
 * @param {string} event 自定义事件名称(VIEW|ERROR|SHARE|UNLOAD|CLICK|USER)
 * @param {string} [data] 任意数据
 */
export function event (event: string, data?: any, value?: number) {
  const evt = event.toUpperCase()
  const supports = [EVENT_VIEW, EVENT_ERROR, EVENT_SHARE, EVENT_UNLOAD, EVENT_CLICK, EVENT_USER]
  if (!~supports.indexOf(event)) {
    throw new Error('not support event `' + event + '`')
  }
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
  }
  return send(evt, data, value)
}

/**
 * 发送用户事件
 * @param {*} [data] 自定义用户相关值
 * @param {number} [value] 相关属性值
 */
export function user (data?: any, value?: number) {
  return event(EVENT_USER, data, value)
}

/**
 * 发送点击事件
 * @param {*} [data] 与点击相关的值
 * @param {number} [value] 与点击相关的值
 * @returns
 */
export function click (data?: any, value?: number) {
  return event(EVENT_CLICK, data, value)
}


let _errorReportHistory: string[] = []
/**
 * 发送错误事件
 * @param {Error} error
 */
export function error (error: Error | string) {
  // 已经达到最大上报次数
  if (!error || _errorReportHistory.length >= config.maxReportError) {
    return false
  }
  let errorStack = analysis.getErrorStack(error)
  // 错误已经上报一次了
  if (!errorStack || _errorReportHistory.indexOf(errorStack) !== -1) {
    return // ignore
  }
  const errCount = _errorReportHistory.push(errorStack)
  return send('ERROR', errorStack, errCount)
}
