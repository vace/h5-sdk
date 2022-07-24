import Auth, { AuthErrorCode, AuthError } from './Auth'
import AuthUser from './AuthUser'
import Config from './Config'
import mlocation from '../plugins/location.web'
import { filterURL, createURL, isFunction } from '../functions/common'

// 可使用此函数实现自定义登陆
type AuthOnRedirectLogin = (url: string) => AuthUser

export default class AuthWeb extends Auth {

  /** 自定义redirect方法 */
  public onRedirectLogin!: AuthOnRedirectLogin

  protected async autoLogin () {
    const { isTokenValid, platform, user, appid, env } = this
    if (isTokenValid) {
      if (user.needRefreshed) {
        return await this.refresh()
      }
      return user
    }
    const { code, state } = mlocation.query
    if (!code || !state) {
      return this.redirectLogin()
    }
    return this.doLogin(`/api/oauth/login/${platform}`, { code, state, appid, env })
  }

  getRedirectLoginUrl () {
    const { platform, appid, env, scope, url, type } = this
    // 跳转到登陆授权页面
    const redirectURL = filterURL(url || mlocation.url, ['code', 'state', 'appid'])
    const redirectArg = { appid, env, scope, type, url: redirectURL }
    const redirect = createURL(Config.API_AUTH + `/api/oauth/redirect/${platform}`, redirectArg)
    return redirect
  }

  redirectLogin () {
    const redirect = this.getRedirectLoginUrl()
    // 支持拦截自定义登陆事件
    if (isFunction(this.onRedirectLogin)) {
      return this.onRedirectLogin(redirect)
    } else {
      location.href = redirect
    }
    return null as never
  }
}
