import App from '../../factory/App'
import Auth from '../../factory/Auth';
import {
  loading,
  success,
  error,
  alert
} from '../ui/ui.mini'
import { parse, stringify } from '../../functions/qs';
import { WxRequestCallbackResult } from '../request/request.mini';

export default function createAppMini () {
  App.showLoading = (message: any) => {
    return loading(typeof message === 'string' ? message : '请稍后...')
  }

  App.showError = (message: any) => {
    return error(message)
  }

  App.showSuccess = (message: any) => {
    return success(message)
  }
  
  App.transformRequest = function (this: App, option: any) {
    const { appid, auth } = this
    const [host, queryString = ''] = option.url.split('?')
    const headers = <Headers>option.headers
    // 支持 {appid}/action 的格式
    if (host.indexOf(appid) === -1) {
      const query = parse(queryString)
      if (!query.appid) {
        query.appid = appid
        option.url = `${host}?${stringify(query)}`
      }
    }
    if (auth && auth.isAuthed && auth.isAccessTokenValid) {
      if (!headers['Authorization']) {
        headers['Authorization'] = <string>auth.accessToken
      }
    }
    return option
  }

  App.transformResponse = (response: WxRequestCallbackResult) => {
    const authorize = response.header['authorization'] || response.header['Authorization']
    const auth = Auth.instance
    if (authorize && auth) {
      auth.saveToken(authorize)
    }
    return response.data
  }

}
