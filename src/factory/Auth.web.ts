import Auth, { AuthErrorCode, AuthError } from './Auth'
import AuthUser from './AuthUser'
import Config from './Config'
import mlocation from '../plugins/location.web'
import { isHasOwn, filterURL, createURL, isFunction } from '../functions/common'

Auth.prototype._requestLogin = async function (): Promise<AuthUser> {
  const { isTokenValid, platform, user } = this
  if (isTokenValid) return user
  const { code, state } = mlocation.query
  if (!code || !state) {
    throw new AuthError(AuthErrorCode.NO_CODE, 'miss `code` and `state`')
  }
  const response = await this.get(`/api/oauth/login/${platform}`, { code, state })
  // logined
  if (isHasOwn(response, 'code') && response.code === 0 && response.data) {
    return user.login(response.data)
  }
  throw new AuthError(AuthErrorCode.LOGIN_FAILED, 'login failed', response)
}

/**
   * 跳转到登陆页面
   * TODO 避免循环重定向登陆
   */
Auth.prototype._redirectLogin =  function(reason: AuthError) {
  const { platform, appid, env, scope, url, type } = this
  // 跳转到登陆授权页面
  const redirectURL = filterURL(url || mlocation.url, ['code', 'state', 'appid'])
  const redirectArg = { appid, env, scope, type, url: redirectURL }
  const redirect = createURL(Config.API_AUTH + `/api/oauth/redirect/${platform}`, redirectArg)

  // 支持拦截自定义登陆事件
  if (isFunction(this.onRedirectLogin)) {
    this.onRedirectLogin(redirect, reason)
  } else {
    location.href = redirect
  }
  throw reason
}

export default Auth