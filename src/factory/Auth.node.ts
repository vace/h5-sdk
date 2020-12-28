import Auth, { AuthErrorCode, AuthError } from './Auth'
import AuthUser from './AuthUser'
import { isFunction } from '../functions/common'

/**
 * Nodejs端的登陆，需要手动提供token
 */

Auth.prototype._requestLogin = async function (): Promise<AuthUser> {
  throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'login failed')
}

Auth.prototype._redirectLogin = function (reason: AuthError) {
  // 支持拦截自定义登陆事件
  if (isFunction(this.onRedirectLogin)) {
    this.onRedirectLogin('', reason)
  }  else {
    throw reason
  }
}

export default Auth
