import '../polyfill/jweixin-1.5.0'

import App from '../factory/App';
import Http from "../factory/Http";
import Emitter from '../factory/Emitter';

import { getServiceUri } from '../config'
import { isWechat } from "../functions/environment";
import { commonResponseReslove, getCurrentHref, getCurrentPathFile } from '../utils/shared';
import { getwx, WeixinJSBridge, isWxMini } from '../utils/global';
import { wait } from '../functions/common';
import { isHttp, isBase64 } from '../functions/is';
import { event } from './analysis';
import { each } from '../functions/underscore';


/** 微信对象，有可能未初始化导致未读取到值 */

/** 配置结构 */
type WxConfigOption = {
  url: string
  debug?: boolean
  appid?: string
  jsApiList: []
}

/** 返回结构 */
interface ConfigResponse extends WxConfigOption {
  timestamp: string
  nonceStr: string
  signature: string
}

/** 设置分享 */
interface ShareOption {
  /* 分享方式 *全部包含, timeline 朋友圈，app 个人|群组|QQ，mini 小程序 */
  type?: '*' | 'timeline' | 'wxapp' | 'mini'
  title?: string
  desc?: string
  link?: string
  // alias imgurl
  img?: string
  /** 小程序使用的5:4图标 */
  banner?: string
  imgurl?: string
  imgUrl?: string
  success?: Function
}

/** 回调事件 */
type WxEventType = 'beforeConfig' | 'config' | 'share' | 'updateShare' | 'error' | 'ready'

/**
 * 默认加载的js api list
 */
export const defaultJsApiList = [
  // 分享
  'updateAppMessageShareData', 'updateTimelineShareData',
  // 常用功能
  'previewImage', 'getNetworkType', 'closeWindow', 'openLocation',
  'chooseImage', 'uploadImage', 'getLocalImgData'
]

/** 事件分发器 */
export const emitter = new Emitter()

const emit = (evt: WxEventType, arg?: any, arg2?: any) => emitter.emit(evt, arg, arg2)

/** 监听事件 */
export const on = (type: WxEventType, callback: EventHandlerNonNull) => emitter.on(type, callback)


let _configPromise: Promise<any>

/**
 * 获取微信签名，一般只用签名一次，不提供appid则从App中读取jsappid
 * @param {WxConfigOption} [option]
 */
export function config (option?: WxConfigOption): Promise<ConfigResponse> {
  // fetch(url)
  return _configPromise || (_configPromise = new Promise((reslove, reject) => {
    if (!option) {
      throw new TypeError('Parameters must be present')      
    }
    // 非微信浏览器，模拟签名
    if (!isWechat) {
      return wait(100).then(reslove)
    }
    // 不存在appid 时从应用配置中读取
    if (!option.appid) {
      option.appid = App.getInstance().jsappid
    }
    emit('beforeConfig', option)
    const { url, debug, appid, jsApiList } = option
    const wx = getwx()
    return Http.instance.get(url || getServiceUri('wechat/signature'), {
      appid,
      url: getCurrentHref(true)
    }).then(commonResponseReslove).then((signature: ConfigResponse) => {
      signature.jsApiList = jsApiList || defaultJsApiList
      signature.debug = !!debug
      emit('config', signature)
      wx.ready(() => {
        emit('ready')
        reslove()
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


enum SHARE_API {
  wxapp = 'updateAppMessageShareData',
  timeline = 'updateTimelineShareData'
}
type ShareType = 'wxapp' | 'timeline' | 'mini'

let _shareMap: Map<string, ShareOption> = new Map()

const updateShareData = (shareType: ShareType, option: ShareOption) => {
  const wx = getwx()
  const shareApi = SHARE_API[shareType]
  let {
    title = document.title,
    desc = ' ',
    link, // 过滤当前隐私字段信息
    imgUrl = '',
    imgurl = '',
    img = '',
    success,
    banner
  } = option
  // 取默认值
  if (!link) {
    link = getCurrentHref(true)
  }
  // 相对路径
  if (!isHttp(link)) {
    link = getCurrentPathFile(link)
  }
  imgUrl = imgUrl || imgurl || img
  if (!isHttp(imgUrl)) {
    imgUrl = getCurrentPathFile(imgUrl || 'share.jpg')
  }
  if (shareType === 'mini') {
    // 推送分享消息到小程序，完成自定义分享
    wx.miniProgram.postMessage({
      data: {
        title,
        link,
        imageUrl: banner || imgUrl
      }
    })
  } else if (typeof wx[shareApi] === 'function') {
    const shareSuccessHandle = () => {
      event('SHARE', shareType) // 触发分享
      emit('share', shareType, option)
      if (typeof success === 'function') {
        success(option)
      }
    }
    option = Object.assign({}, option, { title, desc, link, imgUrl, success: shareSuccessHandle })
    _shareMap.set(shareType, option)
    wx[shareApi](option)
  } else {
    throw new Error(`ShareType ${shareType} dose not exist`);
  }
}

/**
 * 读取/设置 分享参数
 * @param {ShareOption} [option]
 * @returns {Promise<any>}
 */
export function share (option?: ShareOption): any {
  if (!option) {
    return _shareMap
  }
  const { type = '*' } = option
  const globalOption = _shareMap.get('*')
  const oldOption = _shareMap.get(type) || {}
  const newOption = Object.assign({}, globalOption, oldOption, option)
  // 全局配置
  if (type === '*') {
    _shareMap.set(type, newOption)
  }
  // for debug
  window['__wxjs_environment'] = 'miniprogram'
  // 在小程序中需要进一步设置小程序的分享
  if ((type === '*' || type === 'mini') && isWxMini()) {
    updateShareData('mini', newOption)
    if (!_configPromise) return // 防止报错
  }
  if (!_configPromise) {
    throw new TypeError('Please jssdk.config first before sharing');
  }
  return config().then(() => {
    emit('updateShare', newOption)
    // 设置所有分享参数
    if (type === '*') {
      updateShareData('wxapp', newOption)
      updateShareData('timeline', newOption)
    } else {
      updateShareData(type, newOption)
    }
    return newOption
  })
}

/** 上传图片，并获取base64 */
export function chooseImageBase64 (): Promise<string> {
  return api('chooseImage', { count: 1, sizeType: ['compressed'] }).then(({ localIds: [localId] }: any) => {
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
  url = url.map(u => {
    return isHttp(u) ? u : getCurrentPathFile(u)
  })
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
  console.warn('Development 模式，已重写部分函数保证响应')
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
