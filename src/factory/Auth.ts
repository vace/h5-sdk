import Http from './Http'
import AuthUser from './AuthUser'
import Config from './Config'
import hotcache from '../plugins/hotcache'
import { isString, isHasOwn, now, always } from '../functions/common'
import { jwtDecode } from '../plugins/safety'

const AuthStore = hotcache('@SdkTokens')

/**
 * 普通静默登录：`auth.login().then(...)
 */

export enum AuthType { none = 'none', base = 'base', user = 'user' }
export enum AuthErrorCode { OK, NO_CODE, LOGIN_FAILED }
// 可使用此函数实现自定义登陆
type AuthOnRedirectLogin = (url: string, reason: AuthError) => void

// 授权错误
export class AuthError extends Error {
  public code: number
  public data: any
  constructor(code: number, message: string, data?: any) {
    super(`登录失败：${message}`)
    this.code = code
    this.data = data
  }
}

export default class Auth extends Http {
  // 导出用户类
  static AuthUser = AuthUser
  // 导出授权错误类
  static AuthError = AuthError

  /** 用户Auth实例，使用时生成 */
  // @ts-ignore
  public static instance:Auth = null

  /** 转换配置参数，子类可覆盖实现 */
  public static transformAuthOptions = always

  /** 全局请求转换 */
  public static transformAuthRequest(auth: Auth, config: any) {
    if (auth && auth.token) {
      if (!isHasOwn(config, 'headers')) {
        config.headers = {}
      }
      config.headers.Authorization = auth.token
    }
    return config
  }
  /** 全局auth参数接收 */
  public static onAuthHeadersReceived(auth: Auth, header: Headers) {
    const authorization = header.get('Authorization')
    if (authorization) {
      if (authorization === 'LogOut') auth.logout()
      else auth.saveToken(authorization)
    }
  }

  /** 转换用户登陆请求 */
  public static transformAuthResponse (auth: Auth, response: any): AuthUser {
    if (isHasOwn(response, 'code') && response.code === 0 && response.data) {
      return auth.user.login(response.data)
    }
    throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'login failed', response)
  }

  /** 用户实例 */
  public user!: AuthUser
  /** Auth版本号，可修改version强制重新授权 */
  public version!: string
  /** 用户角色 */
  public state!: string
  /** 授权种类 */
  public type!: string
  /** 授权配置 */
  public httpconf!: any
  /** 当前应用所在平台 */
  public platform!: string
  /** 当前应用appid */
  public appid!: string
  /** 当前应用scope */
  public scope!: string
  /** 当前环境 */
  public env!: string
  /** 回调url */
  public url!: string
  /** 自定义redirect方法 */
  public onRedirectLogin!: AuthOnRedirectLogin

  /** 读取当前缓存key */
  get $key() {
    return this.appid + '/' + this.type
  }
  /** 用户ID */
  get id() {
    return this.user.id
  }
  /** 用户是否登录 */
  get isLogin() {
    return this.user.isLogin
  }
  /** 读取当前的token */
  get token(): string {
    const token = AuthStore.get(this.$key)
    // 兼容3.x版本授权
    if (isString(token)) {
      return token.includes('@') ? token.split('@').shift() as string : token
    }
    return ''
  }

  /** 读取jwt信息 */
  get jwt () {
    const { token } = this
    // 'Bearer '.length = 7
    return token ? jwtDecode(token.slice(7)) : null
  }

  /** 读取token是否有效 */
  get isTokenValid(): boolean {
    const { jwt, appid, platform, type } = this
    // jwt data not valid
    if (jwt) {
      const { exp, iss, id, sub, typ } = jwt
      const isNotExp = !exp || exp > now() / 1000 + 7200
      const isIss = iss === appid
      const isSub = sub === platform
      const isTpe = typ === type
      return id && isNotExp && isIss && isSub && isTpe
    }
    return false
  }

  // 初始化
  constructor(options: any) {
    super({
      baseURL: Config.API_AUTH,
      transformRequest: config => Auth.transformAuthRequest(this, config),
      onHeadersReceived: header => Auth.onAuthHeadersReceived(this, header)
    })
    const { platform, appid, type, scope, env, url, version, onRedirectLogin } = Auth.transformAuthOptions(options)
    this.platform = platform
    this.appid = appid
    this.type = type
    this.scope = scope
    this.env = env
    this.url = url
    this.version = version
    this.onRedirectLogin = onRedirectLogin
    this.user = new AuthUser(this)
    if (!(Auth.instance instanceof Auth)) {
      Auth.instance = this
    }
  }

  /** 登陆任务 */
  public tasker!: Promise<AuthUser>
  private $_loginResolve!: Function
  private $_loginReject!: (err: Error) => void

  /** 登陆用户 */
  public login (): Promise<AuthUser> {
    if (this.tasker) return this.tasker
    this.tasker = new Promise((resolve, reject) => {
      this.$_loginResolve = resolve
      this.$_loginReject = reject
    })
    // 尝试使用code 和 state 登陆用户
    this._requestLogin()
      .then(user => this.$_loginResolve(user))
      // 登陆失败，跳转到登录页继续尝试
      .catch(error => this._redirectLogin(error))
      // 捕获上述错误
      .catch(error => this.$_loginReject(error))
    return this.tasker
  }

  /** 授权用户 */
  public authorize (arg: any): Promise<AuthUser> {
    throw new TypeError('authorize is undefined')
  }

  /** 刷新用户资料 */
  public async refresh () {
    const response = await this.get('/api/oauth/refresh')
    return Auth.transformAuthResponse(this, response)
  }

  /** 更新用户token */
  public saveToken(token: string) {
    AuthStore.set(this.$key, token)
  }

  /** 要求用户登出 */
  public logout() {
    AuthStore.remove(this.$key)
    this.user.logout()
  }

  /** 尝试使用现有参数登陆 */
  public async _requestLogin(): Promise<AuthUser> {
    throw new TypeError('_requestLogin is undefined')
  }

  /** 跳转到登录页或自行处理逻辑 */
  public _redirectLogin (reason: AuthError) {
    throw reason
  }
}
