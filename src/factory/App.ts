import { store } from '../plugins/store'
import { getCurrentHref, commonResponseReslove } from "../utils/shared";
import { parse, stringify } from "../functions/qs";
import { wait, randomstr } from "../functions/common";
import Http from "./Http";
import { getServiceUri } from "../config";
import { jwtDecode } from '../plugins/safety';
import { each, now } from '../functions/underscore';
import { isWechat } from '../functions/index';

/**
 * 一个页面一般只有一个应用（可通过`sdk.app`直接获取）
 * @class App
 */
export default class App {
  /** 实例 */
  private static _instance: App
  /** 获取应用实例，`getInstance()`别名 */
  public static get instance () {
    return this.getInstance()
  }
  /** 获取应用实例 */
  public static getInstance () {
    if (!this._instance) {
      this._instance = new App()
    }
    return this._instance
  }
  private static scopes: Record<string, RegisterScopeHandle> = Object.create(null)
  /**
   * 注册scope处理授权
   * @static
   * @param {string} scope
   * @param {RegisterScopeHandle} handle
   */
  public static registerScope (scope: string, handle: RegisterScopeHandle) {
    this.scopes[scope] = handle
  }
  
  /**
   * 获取scope的授权方式
   * @static
   * @param {string} scope
   * @returns {RegisterScope}
   */
  public static parseScope (scope: string): RegisterScopeHandle {
    const parser = this.scopes[scope]
    if (!parser) {
      throw new Error(`The scope '${scope}' is not registered`)
    }
    return parser
  }
  /** 应用是否启动（调用running(方法)） */
  public isRunning: boolean = false
  /** 是否已经登陆 */
  public isLogin: boolean = false

  /** 已经注入用户认证信息的`Http`实例 */
  public $http: Http

  /**
   * 全局配置
   */

  /** 应用的AccessKey缓存名称 */
  public accessCacheKey: string = 'AppAccessToken'
  /** 应用APPID */
  public appid: string = ''
  /** 应用授权scope */
  public scope: string = ''
  /** 应用授权微信appid */
  public wxappid: string = ''
  /** 应用jssdk appid */
  public jsappid: string = ''
  /** 应用平台ID，用作独立授权作用域 */
  public plantform: AppPlatform = 'wechat'

  /**
   * 用户信息
   */

  /** 用户信息结构，未登录时`user.id`=0 */
  public user: AppUserStruct = {
    id: 0,
    // openid: '',
    // nickname: '',
    // avatar: ''
  }

  /** jwt登陆的相关信息 */
  public jwt: JwtBody = {}

  /**
   * Getters And Setters
   */

  /** 本地存储的accessskey */
  private _accessKey: string = ''
  /** 设置accesskey */
  public set accessKey (key: string) {
    if (this._accessKey === key) return
    // logout
    if (!key) {
      this.isLogin = false
      store.remove(this.accessCacheKey)
      this._accessKey = ''
      return
    }
    // 验证key
    const [authType, authBody] = key.split(' ')
    const user = jwtDecode(authBody)
    if (!user) {
      console.log(`decode authorization ${authBody} failed`)
      return
    }
    const {
      // 应用配置参数
      appid, scope, platform, platformId,
      // jwt签名参数
      aud, exp, iat, iss, jti, sub,
      ...userinfo } = <AppAuthResponse> user
    const serverId = [appid, scope, platform].join('.')
    const clientId = [this.appid, this.scope, this.plantform].join('.')
    if (serverId !== clientId) {
      console.log(`authorization checked failed ${clientId} !== ${serverId}`)
      return
    }
    // 存在scope验证结果错误
    if (scope && !App.parseScope(scope).validate.call(this, user)) {
      console.log(`authorization scope validate failed`)
      return
    }
    this.jwt = { aud, exp, iat, iss, jti, sub }
    // 提前一小时过期
    if (exp && exp < now() / 1000 - 3600) {
      console.log(`authorization is overdue`)
      return
    }
    /** 验证成功，登陆成功，写入缓存，赋值登陆信息，写到本地 */
    this.isLogin = true
    this._accessKey = key
    // 保持响应式
    each(userinfo, (val: any, key: string) => this.user[key] = val)
    store.set(this.accessCacheKey, key)
  }

  /** 读取本地的accesskey */
  public get accessKey (): string {
    return this._accessKey
  }

  public constructor () {
    const _this = this
    this.$http = new Http({
      /** 请求时带上appid和authorization */
      transformRequest (option) {
        const [host, queryString = ''] = option.url.split('?')
        const query = parse(queryString)
        const { appid, accessKey } = _this
        const headers = <Headers> option.headers
        if (!query.appid) {
          query.appid = appid
          option.url = `${host}?${stringify(query)}`
        }
        // 未设置authorization
        if (accessKey && !headers.has('authorization')) {
          headers.set('authorization', accessKey)
        }
        return option
      },
      /** 处理header中的authorization */
      transformResponse (response) {
        const authorize = response.headers.get('authorization')
        if (authorize) {
          _this.accessKey = authorize
        }
        return response.json().then(commonResponseReslove)
      }
    })
  }

  /**
   * 设置应用配置
   * @param {AppOption} [option={}]
   * @returns {App}
   */
  public config (option: AppOption = {}): App {
    const { appid, scope, wxappid, jsappid } = option
    // 设置参数
    if (appid) this.appid = appid
    if (scope) this.scope = scope
    if (wxappid) this.wxappid = wxappid
    if (jsappid) this.jsappid = jsappid
    // jsappid 默认读取wxappid
    if (!this.jsappid && wxappid) {
      this.jsappid = wxappid
    }
    return this
  }

  /**
   * 启动应用（只可调用一次）
   */
  public async run (): Promise<AppUserStruct> {
    // 应用已经启动
    if (this.isRunning) {
      console.log('App has been launched.')
      return await this.login()
    }
    // 读取本地缓存的accessKey
    this.accessKey = store.get(this.accessCacheKey) || ''
    // 未登录，但设置了scope
    return await this.login()
  }
  /** 登录任务 */
  private $_tasking?: Promise<any>
  /** 登陆用户 */
  public async login (): Promise<AppUserStruct> {
    this.isRunning = true
    // 已经登陆 或 未设置scope 无需登陆
    if (this.isLogin || !this.scope) {
      return this.user
    }
    if (!this.$_tasking) {
      this.$_tasking = App.parseScope(this.scope).auth(this)
    }
    await this.$_tasking
    return this.user
  }

  /** 登出用户，清空ak即可 */
  public logout () {
    this.$_tasking = void 0 // 清空任务
    this.accessKey = ''
  }
}

/**
 * 注册微信授权解析
 * @param {App} app
 * @returns {Promise<AppAuthResponse>}
 */
async function wechatOauthScope (app: App): Promise<AppAuthResponse> {
  let url = getCurrentHref()
  const { wxappid, scope, $http } = app
  const [host, queryStr] = <any>url.split('?')
  const query: Record<string, string> = parse(queryStr)
  if (query.code) {
    try {
      const uri = getServiceUri('user/loginwx')
      const response: AppAuthResponse = await $http.get(uri, {
        scope: scope,
        wxappid: wxappid,
        code: query.code
      })
      return response
    } catch (error) {
      // 微信 40029: invalid code, 40163: code been used
      if (error.code === 40029 || error.code === 40163) {
        delete query.code
        delete query.state
        const newQuery = stringify(query)
        url = host + (newQuery ? '?' : '') + newQuery
      } else {
        throw error
      }
    }
  }
  const params = {
    appid: wxappid,
    redirect_uri: url,
    response_type: 'code',
    scope: scope,
    // 为防止CRSF攻击，后接随机字符串
    state: wxappid + '.' + randomstr(16)
  }
  const redirect = `https://open.weixin.qq.com/connect/oauth2/authorize?${stringify(params)}#wechat_redirect`
  if (!isWechat) {
    // TODO 不是微信浏览器处理
    return Promise.reject(new Error('请在微信中访问。'))
  } else {
    location.replace(redirect)
    return await wait(500)
  }
}

// 微信：授权处理
const wechatHandle: RegisterScopeHandle = {
  auth: wechatOauthScope,
  validate (this: App, user: AppAuthResponse) {
    return this.wxappid === user.platformId
  }
}
App.registerScope('snsapi_base', wechatHandle)
App.registerScope('snsapi_userinfo', wechatHandle)

/** 注册scope授权处理方法 */
export type RegisterScopeHandle = {
  /** 处理auth */
  auth: (app: App) => Promise<AppAuthResponse>
  /** 检测用户是否合法 */
  validate: (user: AppAuthResponse) => boolean
}

/** 用户结构 */
export type AppUserStruct = {
  /** 用户ID */
  id: number
  /** 用户开放平台ID */
  openid?: string
  /** 用户昵称 */
  nickname?: string
  /** 用户头像 */
  avatar?: string
  /** 其他资料 */
  [key: string]: any
}

/** 应用配置 */
export type AppOption = {
  /** 当前应用appid */
  appid?: string
  /** 授权作用域 */
  scope?: string
  /** 微信授权appid */
  wxappid?: string
  /** 微信jssdk签名id */
  jsappid?: string
  /** 平台种类 */
  plantform?: AppPlatform
}

/** 授权配置 */
export type AppAuthResponse = {
  platform: AppPlatform
  platformId: string
  appid: string
  scope: string
  [key: string]: any
}

/** 应用运行平台，目前支持wechat */
export type AppPlatform = 'wechat'

/** jwt参数 */
type JwtBody = {
  aud?: string
  exp?: number
  iat?: number
  nbf?: number
  iss?: string
  jti?: string
  sub?: string
}
