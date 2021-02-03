import Auth, { AuthErrorCode, AuthError } from './Auth'
import AuthUser from './AuthUser'
import Config from './Config'
import mlocation from '../plugins/location.web'
import { filterURL, createURL, isFunction } from '../functions/common'

Auth.prototype.autoLogin = async function (): Promise<AuthUser> {
  const { isTokenValid, platform, user, appid, env } = this
  if (isTokenValid) {
    if (user.needRefreshed) {
      return await this.refresh()
    }
    return user
  }
  const { code, state } = mlocation.query
  if (!code || !state) {
    throw new AuthError(AuthErrorCode.NO_CODE, 'miss `code` and `state`')
  }
  return this.doLogin(`/api/oauth/login/${platform}`, { code, state, appid, env })
}

/**
   * 跳转到登陆页面
   * TODO 避免循环重定向登陆
   */
Auth.prototype.redirectLogin =  function(reason: AuthError) {
  const { platform, appid, env, scope, url, type } = this
  // 跳转到登陆授权页面
  const redirectURL = filterURL(url || mlocation.url, ['code', 'state', 'appid'])
  const redirectArg = { appid, env, scope, type, url: redirectURL }
  const redirect = createURL(Config.API_AUTH + `/api/oauth/redirect/${platform}`, redirectArg)

  // 支持拦截自定义登陆事件
  if (isFunction(this.onRedirectLogin)) {
    return this.onRedirectLogin(redirect, reason)
  } else {
    location.href = redirect
  }
  throw reason
}

export default Auth
