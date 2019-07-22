import Auth from "../../factory/Auth";
import { UserPlatform, UserType, UserState } from "../../factory/User";

export interface IAuth {
  /** 检测auth是否有效 */
  checkToken (auth: Auth, checkRet: any): boolean
  /** 实现检测是否登陆的接口 */
  checkLogin (auth: Auth): Promise<boolean>
  login (auth: Auth): Promise<any>
  update (auth: Auth, param: any): Promise<any>
  logout (auth: Auth): Promise<any>
  refresh (auth: Auth): Promise<any>
}



/**
 * Auth 授权处理
 */

export interface AuthOption {
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

export interface JwtDecodeRet {
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
