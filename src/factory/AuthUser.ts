import Auth from './Auth'
import hotcache from '../plugins/hotcache'
import { isObject, each } from '../functions/common'

const AuthSymbol = Symbol('auth')
const UserStore = hotcache('@SdkUsers')

export default class AuthUser {

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
  public state: string = ''
  /** 性别，0未知，1男，2女 */
  public gender: number = 0
  /** 用户邮箱 */
  public email: string = ''
  /** 用户名 */
  public username: string = ''
  /** 用户类型 */
  public type: string = ''
  /** 用户地理位置 */
  public location: string = ''
  /** 同一主体下的ID */
  public unionid: string = ''

  private [AuthSymbol]: Auth

  get $key() {
    return this[AuthSymbol].$key
  }
  get isLogin() {
    return this.id > 0
  }

  public constructor(auth: Auth) {
    this[AuthSymbol] = auth
    const user = UserStore.get(this.$key)
    if (isObject(user)) this.reset(user)
  }

  public reset(user: any) {
    each(user, (v, k) => this[k] = v)
  }

  public login(user: any) {
    this.reset(user)
    UserStore.set(this.$key, user)
    return this
  }

  public logout() {
    UserStore.remove(this.$key)
    return this
  }
}
