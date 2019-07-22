import App from '../../factory/App'
import UiModal from '../../factory/UiModal'
import UiToast from '../../factory/UiToast'
import Auth from '../../factory/Auth'
import { parse, stringify } from '../../functions/qs';

export default function createAppWeb () {

  App.showLoading = (showLoading: boolean | string) => new UiToast({
    icon: 'loading',
    message: typeof showLoading === 'string' ? showLoading : '请稍后...'
  }).open()

  App.showSuccess = (showSuccess: string) => new UiToast({
    icon: 'success',
    message: showSuccess
  }).open()

  App.showError = (showError: string) => new UiToast({
    icon: 'err',
    message: showError,
    duration: 3000
  }).open()


  // 转换

  App.transformRequest = function (this: App, option) {
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
    if (auth.isAuthed && auth.isAccessTokenValid) {
      if (!headers.has('authorization')) {
        headers.set('authorization', <string>auth.accessToken)
      }
    }
    return option
  }

  App.transformResponse = (response) => {
    const authorize = response.headers.get('authorization')
    if (authorize) {
      Auth.instance.saveToken(authorize)
    }
    return response.json().then((response) => {
      // -100 ~ -90为登陆错误
      if (response.code <= -90 && response.code > -100) {
        new UiModal({
          title: '用户信息已过期',
          content: '<div style="text-align:left;">您好，您的授权信息已经过期，请刷新页面重试，或点击下方重新登陆按钮重新授权~</div>',
          okText: '重新登陆',
          buttons: [
            {
              label: '重新登陆',
              onClick() {
                Auth.instance.logout()
                location.reload()
              }
            }
          ]
        }).open()
      }
      return response
    })
  }

}
