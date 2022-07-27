import Auth, { AuthError, AuthType, AuthErrorCode } from './Auth'
import AuthUser from './AuthUser'
import { alwaysTrue, alwaysFalse, isHasOwn, isDef, isFunction } from '../functions/common'
import { appid } from '../functions/utils.mini'

declare var wx: any

export default class AuthMini extends Auth {
  public static api = {
    /** 登陆接口 */
    login: '/wx/mini/login',
    /** 头像昵称绑定接口 */
    authorize: '/wx/mini/loginuser',
    /** 手机号绑定接口 */
    bindmobile: '/wx/mini/bindmobile'
  }


  public transformAuthOptions (options: any = {}) {
    options.platform = 'mini'
    // 默认只读取base授权
    if (!isDef(options.type)) {
      options.type = AuthType.base
    }
    if (!isDef(options.appid)) {
      options.appid = appid
    }
    return options
  }

  protected async autoLogin (query?: any) {
    const { appid, user, type, env } = this
    let token = this.token
    if (token) {
      const isValid = await wx.checkSession().then(alwaysTrue, alwaysFalse)
      if (!isValid) {
        this.logout()
        token = ''
      }
    }
    if (!token) {
      const code = await wx.login().then(ret => ret.code, (err: any) => {
        throw new AuthError(AuthErrorCode.NO_CODE, err.errMsg)
      })
      return this.doLogin(AuthMini.api.login, { code, appid, type, env, ...query })
    } else {
      if (user.needRefreshed) {
        return await this.refresh()
      }
    }
    return user
  }

  public async authorize (userinfo?: any) {
    const { appid } = this
    if (!userinfo) {
      const user = await this.login()
      if (!user) {
        throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'authorize login fail', user)
      }
      if (user.type !== AuthType.user) {
        throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'authorize userinfo empty', user)
      }
      this.type = AuthType.user
      return user
    }

    const { encryptedData, iv, signature, errMsg } = userinfo
    if (!encryptedData) {
      throw new AuthError(AuthErrorCode.LOGIN_FAILED, errMsg, userinfo)
    }
    await this.login()
    const param = { iv, data: encryptedData, signature, appid }
    const authuser = await this.doLogin(AuthMini.api.authorize, param)
    return authuser
  }

  async bindmobile (ev: any, query?: any) {
    const { appid } = this
    const { code, encryptedData, iv, signature, errMsg } = ev.detail
    // 可以使用code或者encryptedData获取用户信息
    if (!encryptedData && !code) {
      throw new AuthError(AuthErrorCode.LOGIN_FAILED, errMsg, ev)
    }
    const param = code ? { appid, code } : { iv, data: encryptedData, signature, appid }
    const authuser = await this.get(AuthMini.api.bindmobile, Object.assign(param, query))
    this.user.login(authuser)
    return this.user
  }
}
