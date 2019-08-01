import User from "../../factory/User";
import { parse, stringify } from "../../functions/qs";
import { getApiUri } from "../../config";
import { IAuth } from "./interface";
import Auth from "../../factory/Auth";
import { getCurrentHref } from "../../utils/shared.web";

export default function createAuthNode(): IAuth {
  const fetch = require('node-fetch')

  async function checkIsLogin(auth: Auth) {
    const { code, state } = parse(location.search.slice(1))
    if (!(code && state)) {
      return Promise.resolve(false)
    }
    const { platform, appid, env } = auth
    // 根据用户凭证获取用户信息
    const api = getApiUri(`api/oauth/login/${platform}?` + stringify({ appid, env, code, state }))
    const response = await fetch(api)
    // success
    if (response.status >= 200 && response.status < 300) {
      const authorization = response.headers.get('authorization')
      // check authorization，登陆用户
      if (authorization) {
        auth.saveToken(authorization)
        const data = await response.json()
        if (data && data.data) {
          return auth.user.login(data.data)
        }
      }
    }
    return Promise.resolve(false)
  }

  /**
   * 跳转到授权页面
   * @param url 授权回调页面
   */
  function redirect(auth: Auth) {
    // 清空当前的缓存
    auth.clearToken()
    auth.user.logout()
    const { platform, appid, scope, env, type } = auth
    // 对参数进行强校检
    if (!(platform && appid && scope && type)) {
      throw new Error(`sdk.Auth 配置[platform, appid, scope, type]必须！`);
    }
    if (type !== 'base' && type !== 'user') {
      throw new Error(`sdk.Auth 配置 type 只能为 base | user`);
    }
    // 过滤部分参数
    const url = auth.url || getCurrentHref(['code', 'state', 'appid'])
    const redirect = getApiUri(`api/oauth/redirect/${platform}?` + stringify({ appid, env, scope, url }))
    location.replace(redirect)
  }

  return {
    checkToken(auth, ret) {
      const { isExp, isIss, isSub, isTpe } = ret
      return isExp && isIss && isSub && isTpe
    },
    checkLogin() {
      return Promise.resolve(true)
    },
    async login(auth) {
      const isLogin = await checkIsLogin(auth)
      if (!isLogin) {
        redirect(auth)
      }
      return isLogin
    },
    // 更新用户
    async update() {
      return Promise.resolve(true)
    },
    async logout(auth) {
      const api = getApiUri(`api/oauth/logout`)
      // 清空服务端用户信息
      const response = await fetch(api, {
        headers: {
          Authorization: auth.accessToken || ''
        }
      })
      auth.user.logout()
      auth.clearToken()
    },
    /** 使用token刷新用户信息 */
    async refresh(auth): Promise<User | null> {
      const token = auth.accessToken
      const api = getApiUri('api/oauth/user?' + stringify({ token }))
      const response = await fetch(api)
      if (response.ok) {
        const data = await response.json()
        if (data.data) return auth.user.login(data.data)
      }
      return Promise.resolve(null)
    }
  }
}
