import { isAbsolute, isHasOwn, isString, isHttp, isDef } from '../functions/common'
import Http from './Http'
import Config from './Config'
import Auth from './Auth'
import Tasker from './Tasker'
import hotcache from '../plugins/hotcache'

interface IAppOption {
  baseURL?: string,
  appid: string
  analysisoff?: boolean
}

const AppStore = hotcache('@SdkApps')

//  接口响应错误
export class AppResponseError extends Error {
  public code: number
  public data: number
  public app: App

  constructor(code: number, message: string, data: any, app: App) {
    super(message)
    this.code = code
    this.data = data
    this.app = app
  }
}

export default class App extends Http {
  // APP 响应错误
  static AppResponseError = AppResponseError
  // 转换app的请求
  static transformAppRequest(app: App, config: any) {
    // 转换url
    const api = config.api || config.url
    if (!isAbsolute(api) && !isHttp(api)) {
      config.url = `/app/${app.appid}/${api}`
    } else {
      config.url = api
    }
    const auth = app.auth
    return auth ? Auth.transformAuthRequest(auth, config) : config
  }
  // 转换app响应
  static async transformAppResponse(app: App, response: Response) {
    const json = await response.json()
    app.setHttpMessage('success', '')
    if (isHasOwn(json, 'code')) {
      if (json.code) throw new AppResponseError(json.code, json.message, json.data, app) // 包含错误码则抛出错误
      app.setHttpMessage('success', json.message || json.msg)
      return json.data
    }
    return json
  }

  /** 接收到headers */
  static onAppHeadersReceived(app: App, headers: Headers) {
    const auth = app.auth
    return auth && Auth.onAuthHeadersReceived(auth, headers)
  }

  // @ts-ignore
  static instance: App = null

  public config!: Record<string, any>
  public setting!: Record<string, any>

  // 应用appid
  public appid: string
  // 应用分析
  public analysisoff!: boolean
  // 应用授权
  public get auth () {
    return Auth.instance
  }

  public tasker!: Tasker

  constructor (option: IAppOption | string) {
    const appid = isString(option) ? option : option.appid
    // @ts-ignore
    const baseURL = isDef(option.baseURL) ? option.baseURL : Config.API_APP
    super({
      // set app base api
      baseURL: baseURL,
      // set token
      transformRequest: (request) => App.transformAppRequest(this, request),
      // transform data
      transformResponse: (resposne) => App.transformAppResponse(this, resposne),
      // save token
      onHeadersReceived: (header) => App.onAppHeadersReceived(this, header),
    })
    this.appid = appid
    if (isHasOwn(option, 'analysisoff')) {
      this.analysisoff = !!option['analysisoff']
    }
    this.config = {}
    this.setting = {}
    if (!(App.instance instanceof App)) {
      App.instance = this
    }
  }

  // 应用初始化
  public async ready (): Promise<App> {
    if (this.tasker) return this.tasker
    this.tasker = new Tasker()
    const { appid } = this
    let { version, config, setting } = AppStore.get(appid, {}) as any
    try {
      const server = await this.get('init', { version })
      if (version !== server.version) {
        config = server.config
        setting = server.setting
        AppStore.set(appid, server)
      }
      this.config = config
      this.setting = setting
      return await this.tasker.resolve(this)
    } catch (err) {
      return await this.tasker.reject(err)
    }
  }
}
