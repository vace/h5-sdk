import Auth from './Auth'
import hotcache from '../plugins/hotcache'
import { isObject, each, timestamp } from '../functions/common'

const AuthSymbol = Symbol('auth')
const UserStore = hotcache('@SdkUsers')

// normal=普通用户,black=黑名单用户,admin=管理员用户,super=超级管理员,developer=开发者
type IAuthUserState = 'normal' | 'black' | 'admin' | 'super' | 'developer'

/**
 * 用户类
 */
export default class AuthUser {
  /** 用户资料刷新时间 */
  public static REFRESH_TIME = 2 * 24 * 3600
  /** 用户登录时间 */
  private $logintime: number = 0
  /** 用户ID */
  public id: number = 0
  /** 当前平台 */
  public platform: string = ''
  /** 授权用户appid */
  public appid: string = ''
  /** 用户昵称 */
  public nickname: string = ''
  /** 用户头像 */
  public avatar: string = ''
  /** 用户OPENID */
  public openid: string = ''
  /** 用户状态 */
  public state!: IAuthUserState
  /** 用户名 */
  public username: string = ''
  /** 用户类型 */
  public type: string = ''
  /** 同一主体下的ID */
  public unionid: string = ''
  /** 绑定的auth实例 */
  private [AuthSymbol]: Auth
  /** 原始数据 */
  public get data () {
    return UserStore.get(this.$key)
  }
  /** 缓存key */
  get $key() {
    return this[AuthSymbol].$key
  }
  /** 是否登录 */
  get isLogin() {
    return this.id > 0
  }
  /** 需要刷新资料 */
  get needRefreshed () {
    return this.$logintime < timestamp() - AuthUser.REFRESH_TIME
  }
  /** 实例化auth用户 */
  public constructor(auth: Auth) {
    this[AuthSymbol] = auth
    const user = UserStore.get(this.$key)
    if (isObject(user)) this.reset(user)
  }
  /** 重置用户资料 */
  public reset(user: any) {
    each(user, (v, k) => this[k] = v)
  }
  /** 登录用户 */
  public login(user: any) {
    // 保存用户登录时间
    user.$logintime = timestamp()
    this.reset(user)
    // merge user data
    UserStore.set(this.$key, {...UserStore.get(this.$key), ...user})
    return this
  }
  /** 登出用户 */
  public logout() {
    UserStore.remove(this.$key)
    this.id = 0
  }
}
