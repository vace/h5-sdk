import Auth, { AuthErrorCode, AuthError } from './Auth'
import AuthUser from './AuthUser'
import { isFunction } from '../functions/common'

/**
 * Nodejs端的登陆，需要手动提供token
 * auth.saveToken('xxx')
 */
Auth.prototype.autoLogin = async function (): Promise<AuthUser> {
  if (!this.token) {
    throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'token empty')
  }
  return this.refresh()
  // throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'login failed')
}

Auth.prototype.redirectLogin = function (reason: AuthError) {
  // 支持拦截自定义登陆事件
  if (isFunction(this.onRedirectLogin)) {
    return this.onRedirectLogin('', reason)
  }  else {
    throw reason
  }
}

export default Auth
