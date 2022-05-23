import Auth, { AuthError, AuthType, AuthErrorCode } from './Auth'
import AuthUser from './AuthUser'
import { alwaysTrue, alwaysFalse, isHasOwn, isDef, isFunction } from '../functions/common'
import { appid } from '../functions/utils.mini'

declare var wx: any

Auth.config = {
  api: {
    /** 登陆接口 */
    login: '/wx/mini/login',
    /** 头像昵称绑定接口 */
    authorize: '/wx/mini/loginuser',
    /** 手机号绑定接口 */
    bindmobile: '/wx/mini/bindmobile'
  }
}

Auth.prototype.transformAuthOptions = (_opts) => {
  const options: any = _opts || {}
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

Auth.prototype.autoLogin = async function _requestLogin (query?: any): Promise<AuthUser> {
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
    return this.doLogin(Auth.config.api.login, { code, appid, type, env, ...query })
  } else {
    if (user.needRefreshed) {
      return await this.refresh()
    }
  }
  return user
}

Auth.prototype.redirectLogin = function (reason: AuthError) {
  if (isFunction(this.onRedirectLogin)) {
    return this.onRedirectLogin('', reason)
  }
  throw reason
}

Auth.prototype.authorize = async function authorize (userinfo?: any) {
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
  const authuser = await this.doLogin(Auth.config.api.authorize, param)
  return authuser
}

// 绑定授权手机号
Auth.prototype.bindmobile = async function bindmobile(ev: any, query?: any) {
  const { appid } = this
  const { code, encryptedData, iv, signature, errMsg } = ev.detail
  // 可以使用code或者encryptedData获取用户信息
  if (!encryptedData && !code) {
    throw new AuthError(AuthErrorCode.LOGIN_FAILED, errMsg, ev)
  }
  const param = code ? { appid, code } : { iv, data: encryptedData, signature, appid }
  const authuser = await this.get(Auth.config.api.bindmobile, Object.assign(param, query))
  this.user.login(authuser)
  return this.user
}

export default Auth
