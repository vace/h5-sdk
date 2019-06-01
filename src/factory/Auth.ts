import { assign } from 'es6-object-assign'

import { getCurrentHref } from "../utils/shared";
import { getApiUri } from "../config";
import { stringify, parse } from "../functions/qs";
import { store } from "../plugins/store";
import User, { UserState, UserPlatform, UserType } from "./User";
import { jwtDecode } from "../plugins/safety";
import { now } from "../functions/underscore";
import Tasker from "./Tasker";

/**
 * Auth 授权处理
 */

interface AuthOption {
  /** 指定版本，版本用户批量清空缓存的用户授权信息 */
  version?: string
  /** 指定平台 */
  platform: UserPlatform
  /** 指定平台appid */
  appid: string
  /** 用户种类 */
  type?: UserType
  /** 回调页面 */
  url?: string
  /** 指定scope */
  scope?: string
  /** 指定环境变量 */
  env?: string
}

interface JwtDecodeRet {
  /** 签名有效期 */
  exp: number
  /** 签发者（授权方appid） */
  iss: string
  /** 用户ID */
  id: number
  /** 用户角色 */
  state: UserState
  /** 用户平台 */
  sub: UserPlatform
  /** 用户资料种类 */
  typ: UserType
}

export default class Auth {
  public static option: AuthOption = {
    platform: 'wechat',
    appid: 'wxf4a60c4e95c3db80',
    version: ''// '0.0.0'
  }
  public static cacheKey: string = 'SdkToken'

  /** 实例 */
  private static _instance: Auth
  /** 获取应用实例，`getInstance()`别名 */
  public static get instance() {
    return this.getInstance()
  }
  /** 是否有实例，直接getInstance会新建对象 */
  public static get hasInstance(): boolean {
    return !!this._instance
  }
  /** 获取应用实例 */
  public static getInstance(options?: AuthOption) {
    if (!this._instance) {
      this._instance = new Auth(options)
    }
    return this._instance
  }

  public tasker: Tasker = new Tasker

  /** 是否需要authed */
  public isAuthed: boolean = false

  /** 用户ID */
  public id: number = 0
  /** 用户实例 */
  public user: User = User.instance
  /** Auth版本号 */
  public version!: string
  /** 用户角色 */
  public state!: UserState
  /** 授权种类 */
  public type?: UserType
  /** 授权配置 */
  public option!: AuthOption
  /** 当前应用所在平台 */
  public platform!: UserPlatform
  /** 当前应用appid */
  public appid!: string
  /** 当前应用scope */
  public scope!: string
  /** 当前环境 */
  public env!: string
  /** 回调url */
  public url!: string
  /** 读取accessToken */
  private _accessToken!: string | null
  /** accessToken 是否有效 */
  public isAccessTokenValid: boolean = false

  public constructor (options?: AuthOption) {
    if (options) {
      this.setOption(options)
      this.setup()
    }
  }

  /** 设置accessToken */
  public set accessToken(token: string | null) {
    // debugger
    if (!token || this._accessToken === token) return
    const [tokenType, tokenValue] = token.split(' ')
    if (tokenType !== 'Bearer') throw new TypeError('TokenType Must Be `Bearer`')
    const jwt: JwtDecodeRet = jwtDecode(tokenValue)
    if (!jwt) return
    const { exp, iss, id, state, sub, typ } = jwt
    this.state = state
    this.id = id
    const isValid = 
      (!exp || exp > now() / 1000 - 3600) && // 未设置 exp 或者 过期时间推后 有效isExp
      iss === this.appid && sub === this.platform && // isAppid
      this.type === typ // isType
    // console.log({
    //   isExp: !exp || exp > now() / 1000 - 3600,
    //   isIss: iss === this.appid,
    //   isSub: sub === this.platform,
    //   isTpe: this.type === typ
    // })
    this.isAccessTokenValid = !!isValid
    if (isValid) {
      this._accessToken = token
    } else {
      console.warn('⚠️ 开发者警告：授权方式错误，这样会造成反复授权。请检查参数！')
    }
  }

  /** 读取本地的accessToken */
  public get accessToken(): string | null {
    return this._accessToken
  }

  /**
   * 保存token值
   * @param token 完整的token值
   */
  public saveToken (token: string) {
    if (token) {
      this.accessToken = token
      // cache
      if (this.isAccessTokenValid) {
        // 使用@链接版本号，对比用户信息准确性
        store.set(Auth.cacheKey, token + '@' + this.version)
      }
    }
  }

  /** 设置配置 */
  public setOption (option: AuthOption) {
    const { platform, appid, scope, env, url, type, version } = assign({}, Auth.option, option)
    this.platform = platform
    this.appid = appid
    this.type = type || 'none'
    this.scope = scope || ''
    this.env = env || ''
    this.url = url || ''
    this.version = version
    return this
  }

  /** 运行oauth，获取用户信息 */
  public async setup (): Promise<User | any> {
    const { tasker } = this
    if (tasker.isWorked) {
      return tasker.task
    }
    this.isAuthed = true
    tasker.working()
    if (this.accessToken == null) {
      let [accessToken, tokenVersion = ''] = (store.get(Auth.cacheKey, '') as string).split('@')
      // 用户设置了版本，则需要检测版本是否正确
      if (this.version && this.version !== tokenVersion) {
        this.isAccessTokenValid = false
      } else {
        this.accessToken = accessToken
      }
    }
    // token 无效，重新获取token
    if (!this.isAccessTokenValid) {
      const isLogin = await this.login()
      if (!isLogin) {
        return this.redirect()
      }
    }
    // 用户缓存是否有效
    let user: any = this.user
    // 用户信息不合法
    if (!user.isLogin || user.platform !== this.platform || user.appid !== this.appid || user.userType !== this.type) {
      if (this.accessToken) {
        user = await this.refreshUser()
      }
    }
    // 任务运行完成
    return tasker.resolve(user)
  }
  
  /**
   * 跳转到授权页面
   * @param url 授权回调页面
   */
  public redirect (_url?: string) {
    // 清空当前的缓存
    store.remove(Auth.cacheKey)
    this.user.logout()
    const { platform, appid, scope, env, type } = this
    // 对参数进行强校检
    if (!(platform && appid && scope && type)) {
      throw new Error(`sdk.Auth 配置[platform, appid, scope, type]必须！`);
    }
    if (type !== 'base' && type !== 'user') {
      throw new Error(`sdk.Auth 配置 type 只能为 base | user`);
    }
    // 过滤部分参数
    const url = _url || this.url || getCurrentHref(['code', 'state', 'appid'])
    const redirect = getApiUri(`api/oauth/redirect/${platform}?` + stringify({ appid, env, scope, url }))
    location.replace(redirect)
  }

  /** 使用token刷新用户信息 */
  public async refreshUser (): Promise<User | null> {
    const token = this.accessToken
    const api = getApiUri('api/oauth/user?' + stringify({ token }))
    const response = await fetch(api)
    if (response.ok) {
      const data = await response.json()
      if (data.data) return this.user.login(data.data)
    }
    return Promise.resolve(null)
  }

  /**
   * 登陆当前应用
   */
  public async login () {
    const { code, state } = parse(location.search.slice(1))
    if (!(code && state)) {
      return Promise.resolve(false)
    }
    const { platform, appid, env } = this
    // 根据用户凭证获取用户信息
    const api = getApiUri(`api/oauth/login/${platform}?` + stringify({ appid, env, code, state }))
    const response = await fetch(api)
    // success
    if (response.status >= 200 && response.status < 300) {
      const authorization = response.headers.get('authorization')
      // check authorization，登陆用户
      if (authorization) {
        this.saveToken(authorization)
        const data = await response.json()
        if (data && data.data) {
          return this.user.login(data.data)
        }
      }
    }
    return Promise.resolve(false)
  }
}



// /**
//  * 注册微信授权解析
//  * @param {App} app
//  * @returns {Promise<AppAuthResponse>}
//  */
// async function wechatOauthScope(app: App): Promise<AppAuthResponse> {
//   let url = getCurrentHref()
//   const { wxappid, scope, $http } = app
//   const [host, queryStr] = <any>url.split('?')
//   const query: Record<string, string> = parse(queryStr)
//   if (query.code) {
//     try {
//       const uri = getServiceUri('user/loginwx')
//       const response: AppAuthResponse = await $http.get(uri, {
//         scope: scope,
//         wxappid: wxappid,
//         code: query.code
//       })
//       return response
//     } catch (error) {
//       // 微信 40029: invalid code, 40163: code been used
//       if (error.code === 40029 || error.code === 40163) {
//         delete query.code
//         delete query.state
//         const newQuery = stringify(query)
//         url = host + (newQuery ? '?' : '') + newQuery
//       } else {
//         throw error
//       }
//     }
//   }
//   const params = {
//     appid: wxappid,
//     redirect_uri: url,
//     response_type: 'code',
//     scope: scope,
//     // 为防止CRSF攻击，后接随机字符串
//     state: wxappid + '.' + randomstr(16)
//   }
//   const redirect = `https://open.weixin.qq.com/connect/oauth2/authorize?${stringify(params)}#wechat_redirect`
//   if (!isWechat) {
//     // TODO 不是微信浏览器处理
//     new UiModal({
//       title: '请在微信中打开',
//       content: '抱歉，此页面不支持在此设备上访问，请打开微信，扫一扫下方二维码进入页面',
//       // TODO 二维码服务
//       footer: `<img style="width:100%" src="http://qr.topscan.com/api.php?text=${encodeURIComponent(getCurrentHref())}" >`
//     }).open()
//     return Promise.reject(new Error('请在微信中访问。'))
//   } else {
//     location.replace(redirect)
//     return await wait(500)
//   }
// }
