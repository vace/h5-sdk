import config from "../../config";
import { IAuth } from "./interface";
import { request } from '../request/index'
import Auth from "../../factory/Auth";

declare var wx: any

export default function createAuthMini (): IAuth {
  /**
   * 检测session是否有效
   */
  const checkSession = (): Promise<boolean> => new Promise(resolve => {
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        resolve(true)
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        resolve(false)
      }
    })
  })

  /**
   * 获取登陆code
   */
  const getLoginCode = (): Promise<string> => new Promise((resolve, reject) => {
    wx.login({
      success(res: any) {
        if (res.code) {
          //发起网络请求
          resolve(res.code)
        } else {
          reject(new Error('登录失败！' + res.errMsg))
        }
      }
    })
  })

  const transformAuthResponse = (auth: Auth) => {
    return (response: any) => {
      const { header, data } = response
      const user: any = (data && data.data) || {}
      const Authorization = header['Authorization'] || header['authorization']
      // 同步用户种类 & 防止自检测报错
      auth.type = user.userType
      // 获取到authorization
      if (Authorization) {
        auth.saveToken(Authorization)
      }
      if (user.id) {
        return auth.user.login(user)
      }
      return null
    }
  }


  return {
    // 小程序不检测Tpe
    checkToken(auth, ret) {
      const { isExp, isIss, isSub, isTpe } = ret
      return isExp && isIss && isSub
    },
    // 检测用户session是否有效
    async checkLogin() {
      return await checkSession()
    },
    // 更新用户
    async update (auth, detail) {
      // 尝试登陆用户
      const {
        encryptedData, iv, signature
      } = detail
      const user = await request({
        url: config.api + '/wx/mini/loginuser',
        method: 'POST',
        headers: {
          Authorization: <string> auth.accessToken
        },
        data: { data: encryptedData, iv, signature, appid: auth.appid },
        transformResponse: transformAuthResponse(auth)
      })
      return user
    },
    // 登陆小程序用户
    async login (auth) {
      const authType = auth.type
      if (authType !== 'base' && authType !== 'user') {
        throw new TypeError('sdk.Auth 的参数[type]只能为：base|user 之一');
      }
      const code = await getLoginCode()
      // base 普通授权
      const user = await request({
        url: config.api + '/wx/mini/login',
        method: 'GET',
        data: { code, appid: auth.appid, type: authType },
        transformResponse: transformAuthResponse(auth)
      })
      return user
    },
    async logout () {
      return true
    },
    async refresh () {
      return true
    }
  }
}
