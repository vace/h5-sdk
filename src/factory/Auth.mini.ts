import Auth, { AuthError, AuthType, AuthErrorCode } from './Auth'
import AuthUser from './AuthUser'
import { alwaysTrue, alwaysFalse, isHasOwn, isDef } from '../functions/common'
import { appid } from '../functions/mini'

declare var wx: any

Auth.transformAuthOptions = (_opts) => {
  const options: any = _opts || {}
  options.platform = 'mini'
  if (!isDef(options.type)) {
    options.type = AuthType.base
  }
  if (!isDef(options.appid)) {
    options.appid = appid
  }
  return options
}

Auth.prototype._requestLogin = async function _requestLogin (): Promise<AuthUser> {
  const { appid, user, type } = this
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
    const response = await this.get('/wx/mini/login', { code, appid, type })
    // logined
    if (isHasOwn(response, 'code') && response.code === 0 && response.data) {
      return user.login(response.data)
    }
    throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'login failed', response)
  }
  return user
}

Auth.prototype.authorize = async function authorize (userinfo?: any) {
  const { appid, user } = this
  this.type = AuthType.user // 设置自动登陆
  if (!userinfo) {
    return await this.login()
  }
  const { encryptedData, iv, signature, errMsg } = userinfo
  if (!encryptedData) {
    throw new AuthError(AuthErrorCode.LOGIN_FAILED, errMsg, userinfo)
  }
  await this.login()
  const param = { iv, data: encryptedData, signature, appid }
  const response = await this.get('/wx/mini/loginuser', param)
  // logined
  if (isHasOwn(response, 'code') && response.code === 0 && response.data) {
    return user.login(response.data)
  }
  throw new AuthError(AuthErrorCode.LOGIN_FAILED, response.message, response)
}

export default Auth
