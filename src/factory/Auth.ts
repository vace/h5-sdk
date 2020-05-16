import { assign } from 'es6-object-assign'
import User, { IUserState, IUserPlatform, IUserType } from "./User";
import { jwtDecode } from "../plugins/safety";
import { now } from "../functions/underscore";
import Tasker from "./Tasker";
import { auth } from '../adapters/auth/index'
import { IAuthOption, IJwtDecodeRet, IAuth } from '../adapters/auth/interface';
import cacher from './_cacher'

let ENV_platform = '__PLANTFORM__'

export default class Auth {
  /** 适配器 */
  public static adapter: IAuth = auth

  /** 默认配置 */
  public static option: IAuthOption = {
    // 小程序端自动识别
    platform: ENV_platform === 'mini' ? 'mini' : 'wechat',
    appid: '',
    version: ''// '0.0.0'
  }

  /** 缓存KEY */
  public static cacher = cacher('@SdkTokens')

  /** 实例 */
  private static _instance: Auth
  /** 获取应用实例 */
  public static get instance() {
    if (!this._instance) {
      this._instance = new Auth()
    }
    return this._instance
  }
  /** 是否有实例 */
  public static get hasInstance(): boolean {
    return !!this._instance
  }
  
  /** 创建默认实例（注意，重复创建将覆盖之前的默认实例） */
  public static createInstance(option: IAuthOption): Auth {
    if (this._instance) {
      console.warn('[App.instance] 已存在，此操作将覆盖默认实例')
    }
    return this._instance = new Auth(option)
  }

  public tasker: Tasker = new Tasker

  /** 是否需要authed */
  public isAuthed: boolean = false

  /** 用户ID */
  public id: number = 0
  /** 用户实例 */
  public user!: User
  /** Auth版本号 */
  public version!: string
  /** 用户角色 */
  public state!: IUserState
  /** 授权种类 */
  public type!: IUserType
  /** 授权配置 */
  public option!: IAuthOption
  /** 当前应用所在平台 */
  public platform!: IUserPlatform
  /** 当前应用appid */
  public appid!: string
  /** 当前应用scope */
  public scope!: string
  /** 当前环境 */
  public env!: string
  /** 回调url */
  public url!: string
  /** 读取accessToken */
  public _accessToken!: string | null
  /** accessToken 是否有效 */
  public isAccessTokenValid: boolean = false

  public constructor (options?: IAuthOption) {
    if (options) {
      this.setOption(options)
      this.setup()
    }
    // global instance
    if (!Auth._instance) {
      Auth._instance = this
    }
  }

  /** 设置accessToken */
  public set accessToken(token: string | null) {
    // debugger
    if (!token || this._accessToken === token) return
    const [tokenType, tokenValue] = token.split(' ')
    if (tokenType !== 'Bearer') throw new TypeError('TokenType Must Be `Bearer`')
    const jwt: IJwtDecodeRet = jwtDecode(tokenValue)
    if (!jwt) return
    const { exp, iss, id, state, sub, typ } = jwt
    this.state = state
    this.id = id
    const isExp = !exp || exp > now() / 1000 + 3600
    const isIss = iss === this.appid
    const isSub = sub === this.platform
    const isTpe = typ === this.type
    
    const checkRet = { isExp, isIss, isSub, isTpe }
    const isValid = this.isAccessTokenValid = auth.checkToken(this, checkRet)
    if (isValid) {
      this._accessToken = token
    } else {
      console.warn('Auth授权校检失败：', checkRet)
    }
  }

  /** 读取本地的accessToken */
  public get accessToken(): string | null {
    return this._accessToken
  }

  /** 缓存KEY：应用id/授权类型 */
  public get cacheKey (): string {
    return `${this.appid}/${this.type}`
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
        Auth.cacher.set(this.cacheKey, token + '@' + this.version)
      }
    }
  }

  /** 清除用户Token */
  public clearToken () {
    this._accessToken = ''
    Auth.cacher.remove(this.cacheKey)
  }

  /** 设置配置 */
  public setOption (option: IAuthOption) {
    const { platform, appid, scope, env, url, type, version } = assign({}, Auth.option, option)
    this.platform = platform
    this.appid = appid
    this.type = type || 'none'
    this.scope = scope || ''
    this.env = env || ''
    this.url = url || ''
    this.version = version
    this.user = User.createInstance({ appid: appid, userType: this.type })
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
      const token = Auth.cacher.get(this.cacheKey) || ''
      let [accessToken, tokenVersion = ''] = token.split('@')
      // 用户设置了版本，则需要检测版本是否正确
      if (this.version && this.version !== tokenVersion) {
        this.isAccessTokenValid = false
      } else {
        this.accessToken = accessToken
      }
    }
    // 检测平台内部的token是否有效
    if (this.isAccessTokenValid) {
      const isValidPlantformToken = await this.checkLogin()
      if (!isValidPlantformToken) {
        this.isAccessTokenValid = false
      }
    }
    // token 无效，重新获取token
    if (!this.isAccessTokenValid) {
      const isLogin = await this.login()
      if (isLogin === false) {
        return Promise.reject(new Error('登陆失败！'))
      }
    }
    // 用户缓存是否有效
    let user: any = this.user
    // 用户信息不合法
    if (!user.isLogin || user.platform !== this.platform || user.appid !== this.appid || user.userType !== this.type) {
      if (this.accessToken) {
        user = await this.refresh()
      }
    }
    // 任务运行完成
    return tasker.resolve(user)
  }

  /** 使用token刷新用户信息 */
  public refresh (): Promise<User | null> {
    return auth.refresh(this)
  }

  /** 检测是否登陆 */
  public checkLogin () {
    return auth.checkLogin(this)
  }

  /** 更新用户 */
  public update (param: any) {
    return auth.update(this, param)
  }

  /** 登陆当前应用 */
  public login () {
    return auth.login(this)
  }

  /** 登出当前用户 */
  public logout() {
    return auth.logout(this)
  }
}
