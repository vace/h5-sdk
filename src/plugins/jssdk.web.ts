import Config from "../factory/Config"
import Tasker from "../factory/Tasker"
import App from "../factory/App"
import Auth from "../factory/Auth"
import Res from '../factory/Res.web'
import Http, { HttpError } from "../factory/Http"
import mlocation from './location.web'
import analysis from './analysis.web'
import { isString, isHasOwn, once, uniqueArray, noop, assign, alwaysTrue, createURL, isFunction } from "../functions/common"
import { isWechat, document, isMiniapp } from "../functions/web"

const task = new Tasker()

declare var wx: any

type IJssdkShareItem = { arg: null | IJssdkShareBase, platform: string, api: string, params?: any }

// 小程序分享专用
const MINIAPP_KEYWORD = 'mini'

const DefaultJssdkShare: IJssdkShareItem[] = [
  { arg: null, platform: 'timeline', api: 'onMenuShareTimeline' },
  { arg: null, platform: 'app',      api: 'onMenuShareAppMessage' },
  { arg: null, platform: 'qq',       api: 'onMenuShareQQ' },
  { arg: null, platform: 'weibo',    api: 'onMenuShareWeibo' },
  { arg: null, platform: 'qzone',    api: 'onMenuShareQZone' },
  { arg: null, platform: MINIAPP_KEYWORD, api: 'postMessage' },
]

const DefaultJssdkApi = [
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
]

// 异步加载jssdk资源
const loadJssdk = once(async () => {
  const version = jssdk.version
  const jweixin = (endpoint: string) => `//${endpoint}.wx.qq.com/open/js/jweixin-${version}.js`

  if (typeof wx === 'undefined') {
    try {
      await Res.instance.add(jweixin('res'))
    } catch {
      // 如果上述服务不可用，则加载微信服务2
      await Res.instance.add(jweixin('res2')).catch(noop)
    }
    if (typeof wx === 'undefined') {
      throw new JssdkError('`jweixin-${version}.js` load failed')
    }
  }
  return wx
})

const config = once(async (config: IJssdkConfig) => {
  const { url, debug, appid, jsApiList = [] } = config
  const http = Http.instance
  const wx = await loadJssdk()
  const response = await http.get(url || Config.service('wechat/signature'), {
    appid,
    url: mlocation.url
  })
  if (!isHasOwn(response, 'code')) {
    throw new HttpError(-1, 'response empty', http, response)
  }
  const { code, message, data } = response
  if (code) {
    throw new JssdkError(message)
  }
  const signature = { ...data, debug, jsApiList: uniqueArray([...DefaultJssdkApi, ...jsApiList]) }
  wx.ready(() => task.resolve(true))
  wx.error((err: any) => task.reject(new JssdkError(err.errMsg)))
  wx.config(signature)
  return task
})

// const userShare = new Map()
function share (opts?: string | IJssdkShare) {
  if (!opts || opts === '*') return DefaultJssdkShare
  if (isString(opts)) return DefaultJssdkShare.find(s => s.platform === platform)
  const option = _parseShareOptions(opts)
  const platform = opts.platform
  const filter = platform && platform !== '*' ? (t: any) => t.platform === platform : alwaysTrue
  DefaultJssdkShare.filter(filter).forEach(item => item.arg = assign(item.arg || {}, option))
  return task.then(() => DefaultJssdkShare.forEach(_proxyShareOption))
}

class JssdkError extends Error {}

const jssdk = {
  /** 使用的jssdk版本 */
  version: '1.6.0',
  /** 当前签名appid */
  appid: '',
  /** 分享保留参数 */
  shareLogid: 0,
  /** 定义值 */
  task,
  /** ready 监听 */
  ready: (fn: EventListenerOrEventListenerObject) => document.addEventListener("WeixinJSBridgeReady", fn, false),
  /** 配置处理 */
  config,
  /** 调用分享 */
  share,
  /** 异步加载jssdk */
  loadJssdk,
  /** 错误对象 */
  JssdkError
}

// 在微信浏览器环境中自动加载wx变量
isWechat && loadJssdk()

export default jssdk

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

  if (spm_from === MINIAPP_KEYWORD) {
    if (!isMiniapp) {
      return // 仅在小程序webview中支持
    }
    const app = App.instance
    const appid = app ? app.appid : '' // 应用appid
    const params = share.params = assign({}, arg, { appid })
    return wx.miniProgram.postMessage({ data: params })
  }

  const success = () => {
    analysis.share('wx.' + spm_from, jssdk.shareLogid)
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
  appid?: string
  jsApiList?: string[]
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
