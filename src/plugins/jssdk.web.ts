import Config from "../factory/Config"
import App from "../factory/App"
import Auth from "../factory/Auth"
import Res from '../factory/Res.web'
import Http from "../factory/Http"
import mlocation from './location.web'
import { share as sendAnalysisShare } from './analysis.web'
import tasker, { ITaskerPromise } from './tasker'
import { isString, once, uniqueArray, assign, alwaysTrue, createURL, isFunction, timestamp, nextTick } from "../functions/common"
import { isWechat, document, isMiniapp, domready } from "../functions/utils.web"


/** 签名ready完成事件 */
export const finished = tasker() as ITaskerPromise<boolean>

export type IJssdkShareItem = { arg: null | IJssdkShareBase, platform: string, api: string, params?: any }

export const DefaultJssdkShare: IJssdkShareItem[] = [
  { arg: null, platform: 'timeline', api: 'onMenuShareTimeline' },
  { arg: null, platform: 'app', api: 'onMenuShareAppMessage' },
  { arg: null, platform: 'qq', api: 'onMenuShareQQ' },
  { arg: null, platform: 'weibo', api: 'onMenuShareWeibo' },
  { arg: null, platform: 'qzone', api: 'onMenuShareQZone' },
  { arg: null, platform: 'mini', api: 'postMessage' },
]

/** jssdk 配置 */
export const config = {
  /** 签名URL */
  url: '',
  /** 是否开启debug */
  debug: false,
  /** 使用的jssdk版本 */
  version: '1.6.0',
  /** 当前签名appid */
  appid: '',
  /** 分享保留参数 */
  shareLogid: 0,
  /** 小程序分享专用 */
  mini: 'mini',
  /** 默认的jsapiList */
  jsApiList: [
    'scanQRCode',
    'closeWindow',
    'previewImage',
    'openLocation',
    'getNetworkType',
    'getLocalImgData',
    'hideAllNonBaseMenuItem',
    'updateTimelineShareData',
    'updateAppMessageShareData',
    ...DefaultJssdkShare.map(t => t.api)
  ],
  /**
   * 注入权限验证配置并申请所需开放标签
   * wx-open-launch-app 打开app
   * wx-open-launch-weapp 打开weapp
   */
  openTagList: [] as string[]
}

/** 异步加载jssdk */
export const loadJssdk = once(async () => {
  const version = config.version
  const jweixin = (endpoint: string) => `//${endpoint}.wx.qq.com/open/js/jweixin-${version}.js`

  if (typeof wx === 'undefined') {
    try {
      await Res.js(jweixin('res')).catch(() => Res.js(jweixin('res2')))
    } catch {
      // 如果上述服务不可用，则报错
    }
    if (typeof wx === 'undefined') {
      throw new JssdkError(`jweixin-${version}.js load failed`)
    }
  }
  return wx
})

export const signature = once(async (jssdk: IJssdkConfig) => {
  const wx = await loadJssdk()
  const { url, debug, jsApiList = [], appid, openTagList } = jssdk
  if (appid) config.appid = appid
  if (jsApiList) config.jsApiList.push(...jsApiList)
  if (openTagList) config.openTagList.push(...openTagList)
  if (debug) config.debug = debug
  config.url = url || Config.service('wechat/signature')
  const currentURL = mlocation.url
  // 在微信中请求签名，其他环境中使用适配器模式
  let ticket: any
  if (isWechat) {
    ticket = await Http.get(config.url, { appid: config.appid, url: currentURL })
    if (!ticket || !ticket.appId) {
      const error = new JssdkError('Signature error, required parameter `appId`')
      console.warn(error, ticket)
      finished.reject(error)
      return finished
    }
  } else {
    ticket = { appId: config.appid, url: currentURL, timestamp: timestamp(), signature: '' }
  }
  const signature = assign(ticket, {
    debug: config.debug,
    jsApiList: uniqueArray(config.jsApiList),
    openTagList: config.openTagList
  })
  wx.ready(() => finished.resolve(true))
  wx.error((err: any) => finished.reject(new JssdkError(err.errMsg)))
  wx.config(signature)
  // 不在微信环境中直接resolve
  if (!isWechat) {
    nextTick().then(() => finished.resolve(true))
  }
  return finished
})

/** 调用分享 */
export function share (opts?: string | IJssdkShare) {
  if (!opts || opts === '*') return DefaultJssdkShare
  if (isString(opts)) return DefaultJssdkShare.find(s => s.platform === platform)
  const option = _parseShareOptions(opts)
  const platform = opts.platform
  const filter = platform && platform !== '*' ? (t: any) => t.platform === platform : alwaysTrue
  DefaultJssdkShare.filter(filter).forEach(item => item.arg = assign(item.arg || {}, option))
  return finished.then(() => DefaultJssdkShare.forEach(_proxyShareOption))
}

/** 错误对象 */
export class JssdkError extends Error {}

/** on js ready */
export const onJsReady = (fn: EventListener) => document.addEventListener("WeixinJSBridgeReady", fn, false)
/** on wx ready */
export const onReady = (fn: EventListener | any) => {
  isWechat ? wx.ready(fn) : domready.then(fn)
}

/** 在微信浏览器环境中自动加载wx变量 */
isWechat && loadJssdk()

function _parseShareOptions (opts: IJssdkShare): IJssdkShareBase {
  const { title, desc, link, imgUrl, type, img, imgurl, success, cancel } = opts
  const def = {
    title: title || document.title,
    desc: desc || '',
    link: link || mlocation.safeurl,
    imgUrl: mlocation.getRootFile(imgUrl || imgurl || img || 'share.jpg'),
    success,
    cancel
  } as IJssdkShareBase
  // 其他种类
  if (type && type !== 'link') {
    const { dataUrl, dataurl } = opts
    const url = dataUrl || dataurl
    assign(def, { type, dataUrl: url && mlocation.getRootFile(url) })
  }
  // 小程序中读取 banner: 500x400
  if (isMiniapp) {
    const { banner, config } = opts
    assign(def, { icon: def.imgUrl, config, banner: mlocation.getRootFile(banner || 'banner.jpg') })
  }
  return def
}

function _proxyShareOption (share: IJssdkShareItem) {
  const arg = share.arg
  if (!arg) return false
  let {link, success: userSuccess} = arg
  const spm_uid = Auth.instance && Auth.instance.id || 0
  const spm_from = share.platform
  link = createURL(link, { spm_uid, spm_from }) // 创建追踪url

  if (spm_from === config.mini) {
    if (!isMiniapp) {
      return // 仅在小程序webview中支持
    }
    const app = App.instance
    const appid = app ? app.appid : '' // 应用appid
    const params = share.params = assign({}, arg, { appid })
    return wx.miniProgram.postMessage({ data: params })
  }

  const success = () => {
    sendAnalysisShare('wx.' + spm_from, config.shareLogid)
    if (isFunction(userSuccess)) {
      userSuccess(spm_from)
    }
  }
  const params = share.params = assign({}, share.arg, { success, link })
  wx[share.api](params)
}

/** 配置结构 */
export type IJssdkConfig = {
  url?: string
  debug?: boolean
  appid: string
  jsApiList?: string[],
  openTagList?: string[]
}

/** h5 push到小程序的消息结构 */
export type IJssdkMessageMini = {
  /** 应用ID */
  appid: string
  /** 分享标题 */
  title: string
  /** 分享描述 */
  desc: string
  /** 分享链接 */
  link: string
  /** 分享图标 */
  icon: string
  /** 自定义小程序分享图标 */
  banner: string
}

/** 返回结构 */
export interface IJssdkResponse extends IJssdkConfig {
  timestamp: string
  nonceStr: string
  signature: string
}

export interface IJssdkShareBase {
  platform: string
  title: string
  desc: string
  link: string
  imgUrl: string
  success: any
  cancel: any
}

/** 设置分享 */
export interface IJssdkShare {
  /* 分享方式 *全部包含, timeline 朋友圈，app 个人|群组|QQ，mini 小程序 */
  platform?: string
  title?: string
  desc?: string
  link?: string
  // alias imgurl
  img?: string
  /** 小程序使用的5:4图标 */
  banner?: string
  imgurl?: string
  imgUrl?: string
  /** 自定义其他配置 */
  logid?: number // 日志id
  config?: string // 小程序配置参数
  success?: Function
  cancel?: Function,

  // 音视频控制
  type?: 'music'| 'video' | 'link',
  dataUrl?: string
  dataurl?: string
}

/** h5 push到小程序的消息结构 */
export type IJssdkShareMini = {
  /** 应用ID */
  appid: string
  /** 分享标题 */
  title: string
  /** 分享描述 */
  desc: string
  /** 分享链接 */
  link: string
  /** 分享图标 */
  icon: string
  /** 自定义小程序分享图标 */
  banner: string
}
