import { each } from "../functions/underscore";
import store from "../adapters/store/index";

/** 用户状态:normal=普通用户,black=黑名单用户,admin=管理员用户,super=超级管理员,developer=开发者 */
export type IUserState = 'unknow' | 'normal' | 'black' | 'admin' | 'super' | 'developer'

/** 支持的平台 */
export type IUserPlatform = 'unknow' | 'wechat' | 'qq' | 'taobao' | 'weibo' | 'douyin' | 'github' | 'google' | 'linkedin' | 'facebook' | 'open' | 'mini'

/** 用户种类，base只有用户id，user包含头像昵称 */
export type IUserType = 'none' | 'base' | 'user'

/** 用啥结构 */
export default class User {
  /** 当前用户 */
  private static cacheKey: string = 'SdkUser'
  /** 实例 */
  private static _instance: User
  /** 获取用户实例 */
  public static get instance() {
    if (!User._instance) {
      const cache = store.get(User.cacheKey)
      User._instance = new User(cache)
    }
    return User._instance
  }
  /** 是否登陆 */
  public isLogin!: boolean
  /** 用户ID */
  public id: number = 0
  /** 当前平台 */
  public platform!: IUserPlatform
  /** 授权用户appid */
  public appid: string = ''
  /** 用户昵称 */
  public nickname: string = ''
  /** 用户头像 */
  public avatar: string = ''
  /** 用户OPENID */
  public openid: string = ''
  /** 用户状态 */
  public state!: IUserState
  /** 性别，0未知，1男，2女 */
  public gender: number = 0
  /** 用户邮箱 */
  public email: string = ''
  /** 用户名 */
  public username: string = ''
  /** 用户类型 */
  public userType!: IUserType
  /** 用户地理位置 */
  public location: string = ''
  /** 同一主体下的ID */
  public unionid: string = ''

  public constructor (user?: any) {
    if (user) {
      this.login(user)
    }
  }

  /** 登陆用户 */
  public login (user: any) {
    if (user && user.id) {
      this.isLogin = true
      // 同步用户信息到user对象中
      each(user, (val: any, key: any) => this[key] = val)
      store.set(User.cacheKey, user)
    }
    return this
  }

  /** 登出用户 */
  public logout () {
    store.remove(User.cacheKey)
    this.isLogin = false
    this.id = 0
  }
}
