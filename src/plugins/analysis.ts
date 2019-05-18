import App from "../factory/App";

import { addEventListener, location } from "../utils/global";
import { getCurrentHref } from "../utils/shared";
import { randomstr  } from "../functions/common";
import { now } from "../functions/underscore";
import { parse, stringify } from '../functions/qs'
import { domready } from '../functions/helper'
import { getServiceUri } from "../config";
import _config from "../config";
import { signature } from "./safety";

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
export const config: AnalysisOption = Object.assign({
  disabled: false,
  maxReportError: 3,
  beforeLoadTime: new Date().getTime(),
  unloadData: ''
}, _config.analysis)

/**
 * 内置的数据分析系统
 * 
 * 渠道示例  tx.wx.pyq 腾讯.微信.朋友圈
 * 
 * # 术语表
 * @see https://mta.qq.com/docs/h5_advance_access.html
 * 浏览量（pv） 页面被打开的次数 每个页面被打开一次，计为1次访问
 * 独立访客（uv）访客1天内去除重复访问次数 1天内相同访客访问次数只计1次访问
 * 访问次数（vv）访客1天内访问次数 从访客来到您网站到最终关闭网站的所有页面离开，计为1次访问
 * 独立IP 1天内访问的IP数
 * 
 */

/** 事件集合 */
type ANA_EVENTS = 'VIEW' | 'ERROR' | 'SHARE' | 'UNLOAD' | string

// 报错处理与上报
addEventListener('error', e => error(e.error), false)

// 文档卸载，记录访问时长
addEventListener('unload', (e) => {
  // 计算页面停留市场
  const stayTime = (now() - config.beforeLoadTime) / 1000
  event('UNLOAD', config.unloadData, stayTime)
}, false)

/** 参数map */
enum ANA {
  APPID = 'ai', // 应用appid
  USER_AGENT = 'ua', // 应用UA
  PAGE_URL = 'ul', // 应用URL
  USER_ID = 'ui', // 用户ID
  EVENT_NAME = 'ev', // 应用事件
  SEND_DATA = 'sd', // 发送数据
  SEND_VALUE = 'vl', // 发送值（必须为数字）
  SDK_VERSION = 'vr', // 版本号
  REQEST_NONCE = '_n', // 随机数
  REQEST_SIGNATURE = '_s' // 此次请求签名
}

/**
 * 发送指定事件
 * @param {ANA_EVENTS} event 事件名称
 * @param {string} [data=''] 事件数据
 * @param {number} [value=0] 事件数值
 */
async function send (event: ANA_EVENTS, data: string = '', value: number = 0): Promise<void> {
  const app = App.getInstance()
  // 无应用，不发送数据
  if (!app.appid || config.disabled) {
    return
  }
  let userId = 0
  // 如果应用已经启动，需要通过login接口获取uid
  if (app.isInited) {
    const user = await app.ready()
    if (user) {
      userId = user.id
    }
  }
  // 提交的数据选项
  const option: any = {
    [ANA.APPID]: app.appid,
    [ANA.USER_AGENT]: navigator.userAgent,
    [ANA.PAGE_URL]: getCurrentHref(true),
    [ANA.USER_ID]: userId,
    [ANA.SDK_VERSION]: '__VERSION__',
    [ANA.EVENT_NAME]: event,
    [ANA.SEND_DATA]: data,
    [ANA.SEND_VALUE]: Math.round(value || 0),
    [ANA.REQEST_NONCE]: randomstr(16)
  }
  option[ANA.REQEST_SIGNATURE] = signature(option)
  //! 注意：此参数用于去除跨域请求，不参与签名
  option.cros = 'off'
  await domready
  const image = new Image()
  image.src = getServiceUri('analysis/log') + '?' + stringify(option)
}

/**
 * 发送PV记录，记录用户UA、来源记录
 * 根据页面 from 或者 ADTAG 参数统计来源
 * 如：page.html?ADTAG=ali.taobao.browser
 */
export function pv () {
  const params: any = parse(location.search.slice(1))
  const ADTAG = params.ADTAG || params.from
  const defaultTags: any = {
    timeline: 'tx.wx.tl', // 朋友圈
    groupmessage: 'tx.wx.gm', // 群组消息
    singlemessage: 'tx.wx.sm', // 好友消息
  }
  const timing = performance.timing || {}
  const loadTime = (now() - (timing.fetchStart || config.beforeLoadTime)) || 0
  return send('VIEW', defaultTags[ADTAG] || 'url', loadTime)
}

/**
 * 发送自定义事件
 * @param {string} event 自定义事件名称
 * @param {string} [data] 任意数据
 */
export function event (event: string, data?: string, value?: number) {
  if (!/^\w+$/.test(event)) {
    throw new Error('event must be alphanumeric')
  }
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
  }
  return send(event.toUpperCase(), data, value)
}


let _errorReportHistory: string[] = []
/**
 * 发送错误事件
 * @param {Error} error
 */
export function error (error: Error) {
  // 已经达到最大上报次数
  if (!error || _errorReportHistory.length >= config.maxReportError) {
    return false
  }
  if (!(error instanceof Error)) {
    console.log(`error arg must instanceof Error`)
    return
  }
  let errorStack
  if (error.stack) {
    errorStack = error.stack.split('\n').slice(0, 2).join('')
  } else {
    errorStack = error.name + ': ' + error.message
  }
  // 错误已经上报一次了
  if (_errorReportHistory.indexOf(errorStack) !== -1) {
    return // ignore
  }
  const errCount = _errorReportHistory.push(errorStack)
  return send('ERROR', errorStack, errCount)
}
