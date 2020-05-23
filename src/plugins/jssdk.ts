import '../polyfill/jweixin-1.6.0'

import { assign } from 'es6-object-assign'

import App from '../factory/App';
import Http from "../factory/Http";
import Emitter from '../factory/Emitter';

import { getServiceUri } from '../config'
import { isWechat, isMiniapp } from "../functions/environment";
import { getCurrentHref, getCurrentPathFile } from '../utils/shared';
import { commonResponseReslove } from '../utils/common'
import { getwx, WeixinJSBridge } from '../utils/global';
import { wait, noop } from '../functions/common';
import { isHttp, isBase64 } from '../functions/is';
import { event, EVENT_SHARE } from './analysis';
import { each } from '../functions/underscore';
import { parse, stringify } from '../functions/qs';
import Auth from '../factory/Auth';

let wechatJssdkAppid: string

/** 页面是否已经签名 */
// let pageIsSignured: boolean

/** 微信对象，有可能未初始化导致未读取到值 */

/** 配置结构 */
export type IWxConfigOption = {
  url?: string
  debug?: boolean
  appid?: string
  jsApiList?: any[]
}

/** h5 push到小程序的消息结构 */
export type IPostMessageStruct = {
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
export interface IConfigResponse extends IWxConfigOption {
  timestamp: string
  nonceStr: string
  signature: string
}

/** 设置分享 */
export interface IWxShareOption {
  /* 分享方式 *全部包含, timeline 朋友圈，app 个人|群组|QQ，mini 小程序 */
  platform?: '*' | SharePlatform
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
  config?: string
  success?: Function
  cancel?: Function
}

/** 回调事件 */
export type IWxEventType = 'beforeConfig' | 'config' | 'share' | 'updateShare' | 'error' | 'ready'

// 分享函数配置
const SHARE_PLATFORMS = {
  // 这2个API没有success回调，暂不启用
  // app: 'updateAppMessageShareData',
  // app: 'updateTimelineShareData',
  timeline: 'onMenuShareTimeline',
  app: 'onMenuShareAppMessage',
  qq: 'onMenuShareQQ',
  weibo: 'onMenuShareWeibo',
  qzone: 'onMenuShareQZone',
  mini: setMiniappShare
}

// 小程序分享专用
const MINIAPP_KEYWORD = 'mini'

/**
 * 默认加载的js api list
 */
export const defaultJsApiList = [
  'updateAppMessageShareData', 'updateTimelineShareData',
  // 常用功能
  'previewImage', 'getNetworkType', 'closeWindow', 'openLocation',
  'chooseImage', 'uploadImage', 'getLocalImgData'
]

// 分享API设置
each(SHARE_PLATFORMS, (api: string) => typeof api === 'string' && defaultJsApiList.push(api))

/** 事件分发器 */
export const emitter = new Emitter()

const emit = (evt: IWxEventType, arg?: any, arg2?: any) => emitter.emit(evt, arg, arg2)

/** 监听事件 */
export const on = (type: IWxEventType, callback: EventHandlerNonNull) => emitter.on(type, callback)

/** wx.ready触发，不在微信浏览器则直接触发 */
export function ready (fn: Function) {
  if (isWechat) {
    getwx().ready(fn)
  } else {
    setTimeout(fn, 0)
  }
}

let _configPromise: Promise<any>

/**
 * 获取微信签名，一般只用签名一次，不提供appid则从App中读取jsappid
 * @param {IWxConfigOption} [option]
 */
export function config (option?: IWxConfigOption): Promise<IConfigResponse> {
  // fetch(url)
  return _configPromise || (_configPromise = new Promise((reslove, reject) => {
    if (!option) {
      throw new TypeError('Parameters must be present')      
    }
    const { url, debug, appid, jsApiList } = option
    wechatJssdkAppid = appid as string
    // 非微信浏览器，模拟签名
    if (!isWechat) {
      return wait(100).then(reslove)
    }
    emit('beforeConfig', option)
    const wx = getwx()
    return Http.instance.get(url || getServiceUri('wechat/signature'), {
      appid,
      // 注意这里的URL必须是去除锚点包含完整参数的URL，签名校验非常严格
      url: getCurrentHref()
    }).then(commonResponseReslove).then((signature: IConfigResponse) => {
      signature.jsApiList = jsApiList || defaultJsApiList
      signature.debug = !!debug
      emit('config', signature)
      wx.ready(() => {
        emit('ready')
        const auth = Auth.instance
        // 尝试获取用户信息
        if (auth.isAuthed) {
          auth.tasker.task.then(reslove)
        } else {
          reslove()
        }
      })
      wx.error((err: any) => {
        emit('error', err)
        reject(err)
      })
      wx.config(signature)
      return signature
    })
  }))
}

/**
 * 用于微信browser中自动播放视频、音频等操作
 * @param {Function} resolve
 */
export function fire (resolve: Function) {
  if ('object' == typeof WeixinJSBridge && isWechat) {
    WeixinJSBridge.invoke('getNetworkType', {}, resolve)
  } else {
    resolve()
  }
}

/** 获取当前应用的appid */
export function getAppid (): string {
  return wechatJssdkAppid
}

// enum SHARE_API {
//   wxapp = 'updateAppMessageShareData',
//   timeline = 'updateTimelineShareData'
// }

// 分享种类
type SharePlatform = 'timeline' | 'app' | 'qq' | 'weibo' | 'qzone' | 'mini'

let shareConfigCache: Map<string, IWxShareOption> = new Map()

/**
 * 读取/设置 分享参数
 * @param {IWxShareOption} [option]
 * @returns {Promise<any>}
 */
export function share (option?: IWxShareOption): any {
  if (!option) {
    return shareConfigCache
  }
  const sharePlatform = option.platform || '*'
  const isAllType = sharePlatform === '*'
  if (!_configPromise) {
    throw new TypeError('sdk.jssdk 需要预先签名才可使用！详见文档。');
  }
  return config().then(() => {
    if (isAllType) {
      // 设置分享
      each(SHARE_PLATFORMS, (api: string, platform: string) => {
        triggerShare(platform, _parseShareOption(option, platform))
      })
    } else {
      triggerShare(sharePlatform, _parseShareOption(option, sharePlatform))
    }
    return shareConfigCache
  })
}

/** 触发分享 */
function triggerShare (platform: string, setting: any) {
  const wx = getwx()
  const api = SHARE_PLATFORMS[platform]
  if (typeof api === 'function') {
    api(setting)
  } else if (typeof wx[api] === 'function') {
    wx[api](setting)
  } else {
    throw new TypeError(`sdk.jssdk.share 不支持分享类型 ${platform}`)
  }
  shareConfigCache.set(platform, setting)
}

/** 设置小程序分享 */
export function setMiniappShare (option: IWxShareOption) {
  return isMiniapp && getwx().miniProgram.postMessage({ data: option as IPostMessageStruct })
}

function _sendShareLog (platform: string) {
  const setting = shareConfigCache.get(platform)
  event(EVENT_SHARE, 'wx.' + platform, setting && setting.logid || 0)
}

function _parseShareOption (option: IWxShareOption, platform: string) {
  const resetSuccess = option.success

  const prevConfig = assign({}, shareConfigCache.get(platform) || {}, option)
  let { title = document.title, desc = ' ', link, imgUrl = '', imgurl = '', img = '', success, cancel = noop, logid } = prevConfig

  if (typeof resetSuccess === 'function') {
    success = () => {
      resetSuccess(platform)
      _sendShareLog(platform)
    }
  }
  // 设置发送日志
  if (typeof success !== 'function') {
    success = () => _sendShareLog(platform)
  }

  // 取默认值
  if (!link) link = getCurrentHref(true)
  // 相对路径
  if (!isHttp(link)) link = getCurrentPathFile(link)
  // link 追加用户来源，增加spm
  const auth = Auth.hasInstance ? Auth.instance : null
  if (auth && auth.isAuthed) {
    const [host, queryString] = link.split('?')
    const query = parse(queryString)
    query.spm_uid = auth.id
    link = host + '?' + stringify(query)
  }
  imgUrl = imgUrl || imgurl || img
  if (!isHttp(imgUrl)) {
    imgUrl = getCurrentPathFile(imgUrl || 'share.jpg')
  }
  const parsedConfig = { title, desc, imgUrl, link, logid }
  let extConfig: any
  if (platform === MINIAPP_KEYWORD) {
    let { banner = 'banner.jpg', config } = option
    banner = isHttp(banner) ? banner : getCurrentPathFile(banner)
    const appid = App.hasInstance ? App.instance.appid : '' // 应用appid
    extConfig = { banner, config, appid }
  } else {
    extConfig = { success, cancel }
  }
  assign(parsedConfig, extConfig)
  return parsedConfig
}

/** 上传图片，并获取base64 */
export function chooseImageBase64 (option): Promise<string> {
  return api('chooseImage', option || { count: 1, sizeType: ['compressed'] }).then(({ localIds: [localId] }: any) => {
    return api('getLocalImgData', { localId }).then(({ localData }: any) => {
      const mime = 'image/jpeg'
      // fixed 安卓下的bug
      if (!isBase64(localData)) {
        return `data:${mime};base64,${localData}`
      } else {
        // ios 下会识别 jgp 格式，转换为jpeg
        return localData.replace('image/jgp', mime)
      }
    })
  })
}

/**
 * 预览图片
 * @param {(string | string[])} url 链接列表，支持相对路径
 * @param {number} [index=0] 默认展示索引
 */
export function preview (url: string | string[], index: number = 0) {
  if (typeof url === 'string') url = [url]
  url = url.map(u => (isBase64(u) || isHttp(u)) ? u : getCurrentPathFile(u))
  getwx().previewImage({
    current: url[index],
    urls: url
  })
}

/**
 * 使用promise方式调用微信API
 * @param {string} apiName
 * @param {*} [option={}]
 * @returns {Promise<any>}
 */
export function api (apiName: string, option: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const wx = getwx()
    if (typeof wx[apiName] === 'function') {
      option.success = resolve
      option.fail = reject
      wx[apiName](option)
    } else {
      reject(new Error(`wx.${apiName} is not api`))
    }
  })
}

if (process.env.NODE_ENV === 'development' && !isWechat) {
  console.warn('development 模式，已重写部分函数保证响应')
  const base64Img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  const localId = 'DebugModeMockLocalIdData'
  const serverId = 'DebugModeMockServerIdData'
  const rewriteMap = {
    chooseImage: { localIds: [localId, localId] },
    uploadImage: { serverId },
    downloadImage: { localId },
    getLocalImgData: { localData: base64Img },
    stopRecord: { localId },
    uploadVoice: { serverId },
    downloadVoice: { localId },
    translateVoice: { translateResult: 'Debug Mode Translate Voice Text' },
    getNetworkType: { networkType: 'wifi' },
    getLocation: { latitude: 31.813084, longitude: 117.203995, speed: 1, accuracy: 1 },
    scanQRCode: { resultStr: 'Debug Mode ScanQRCode Text' },
    chooseWXPay: { result: 'ok' },
    openAddress: { userName: '收货人姓名', postalCode: '510630', provinceName: '广东省', cityName: '广州市',countryName: '天河区', detailInfo: '详细收货地址信息', nationalCode: '86', telNumber: '18888887777'}
  }
  // console.table(Object.keys(rewriteMap))
  const wx = getwx()
  // 重写
  each(rewriteMap, (val: any, key: string) => {
    wx[key] = (args: any) => {
      console.log(`method rewrite: wx.${key}(${JSON.stringify(args)})`)
      if (args && typeof args.success === 'function') {
        args.success(val)
      } else {
        console.log('args.success() empty')
      }
    }
  })
}
