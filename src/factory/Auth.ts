import Http from './Http'
import AuthUser from './AuthUser'
import Config from './Config'
import hotcache from '../plugins/hotcache'
import { isString, isHasOwn, now } from '../functions/common'
import { jwtDecode } from '../plugins/safety'
import tasker from '../plugins/tasker'

const AuthStore = hotcache('@SdkTokens')

/**
 * 普通静默登录：`auth.login().then(...)
 */

export const enum AuthType { none = 'none', base = 'base', user = 'user' }
export enum AuthErrorCode { OK, NO_CODE, LOGIN_FAILED }

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

/**
 * Auth 授权
 */
export default class Auth extends Http {
  /** auth配置 */
  static config: Record<string, any> = {}
  /** 导出用户类 */
  static AuthUser = AuthUser
  /** 导出授权错误类 */
  static AuthError = AuthError

  /** 用户Auth实例，使用时生成 */
  // @ts-ignore
  public static instance!: Auth = null

  /** 用户实例 */
  public user: AuthUser
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
  /** 仅在子类中使用 */
  protected $tryUseAuth = true

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

  /**
   * 实例化Auth，只有一个实例可通过Auth.instance获取
   * @param options 初始化Auth
   */
  constructor(options: any = {}) {
    super({ baseURL: options.baseURL || Config.API_AUTH })
    const { platform, appid, type, scope, env, url } = this.transformAuthOptions(options)
    platform && (this.platform = platform)
    appid && (this.appid = appid)
    type && (this.type = type)
    scope && (this.scope = scope)
    env && (this.env = env)
    url && (this.url = url)
    // 设置默认实例
    if (!Auth.instance) {
      Auth.instance = this
    }
    this.user = new AuthUser(this)
  }

  public tasker = tasker<AuthUser>()

  private isLogining = false

  /** 登陆用户 */
  public login (): Promise<AuthUser> {
    if (this.isLogining) {
      return this.tasker
    }
    this.isLogining = true
    this.autoLogin()
      .then(user => this.tasker.resolve(user))
      .catch(error => this.tasker.reject(error))
    return this.tasker
  }

  /** 刷新用户资料 */
  public async refresh () {
    const response = await this.get('/api/oauth/refresh')
    return this.transformAuthResponse(response)
  }

  /** 更新用户token */
  public saveToken(token: string) {
    AuthStore.set(this.$key, token)
  }

  /** 要求用户登出 */
  public logout() {
    AuthStore.remove(this.$key)
    this.user.logout()
    this.isLogining = false
    return Promise.resolve(this.user)
  }

  /** 尝试使用现有参数登陆 */
  protected autoLogin(): Promise<AuthUser> {
    throw new TypeError('_requestLogin is undefined')
  }

  /** 跳转到登陆 */
  public doLogin (loginApi: string, query: any): Promise<AuthUser> {
    return this.get(loginApi, query)
      .then(response => this.transformAuthResponse(response))
  }

  /** 转换配置参数，子类可覆盖实现 */
  public transformAuthOptions (opts: any) {
    return opts
  }

  /** 全局请求转换 */
  public transformAuthRequest(config: any) {
    if (this && this.token) {
      if (!isHasOwn(config, 'headers')) {
        config.headers = {}
      }
      config.headers.Authorization = this.token
    }
    return config
  }
  /** 全局auth参数接收 */
  public onAuthHeadersReceived(header: Headers) {
    const authorization = header.get('Authorization')
    if (authorization) {
      if (authorization === 'LogOut') this.logout()
      else this.saveToken(authorization)
    }
  }

  /** 转换用户登陆请求 */
  public transformAuthResponse(userdata: any): AuthUser {
    if (userdata) {
      const user = this.user.login(userdata)
      this.tasker.resolve(user)
      return user
    }
    throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'login failed', userdata)
  }
}
