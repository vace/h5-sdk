import Auth, { AuthErrorCode, AuthError } from './Auth'
import AuthUser from './AuthUser'
import { isFunction } from '../functions/common'

/**
 * Nodejs端的登陆，需要手动提供token
 * auth.saveToken('xxx')
 */

export default class AuthNode extends Auth {
  protected async autoLogin () {
    if (!this.token) {
      throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'token empty')
    }
    return this.refresh()
  }
}
