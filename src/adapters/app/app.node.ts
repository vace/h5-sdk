import App from '../../factory/App'
import Auth from '../../factory/Auth';
import { parse, stringify } from '../../functions/qs';

export default function createAppMini() {
  const ora = require('ora')

  App.showLoading = (message: any) => {
    const spinner = ora(typeof message === 'string' ? message : '请稍后...').start()
    return {close: () => spinner.succeed()}
  }

  App.showError = (message: any) => {
    return console.error(message)
  }

  App.showSuccess = (message: any) => {
    const spinner = ora(message).start()
    return spinner.succeed()
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

  App.transformResponse = (response: any) => {
    const authorize = response.headers.get('authorization')
    const auth = Auth.instance
    if (authorize && auth) {
      auth.saveToken(authorize)
    }
    return response.json()
  }

}
