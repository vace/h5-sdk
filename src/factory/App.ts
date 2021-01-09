import { isAbsolute, isHasOwn, isString, isHttp, isDef, isFunction } from '../functions/common'
import Http from './Http'
import Config from './Config'
import Auth from './Auth'
import hotcache from '../plugins/hotcache'
import tasker, { ITaskerPromise } from '../plugins/tasker'

interface IAppOption {
  /** 应用接口根路径 */
  baseURL?: string,
  /** 应用appid */
  appid?: string
  /** 是否关闭日志分析 */
  analysisoff?: boolean
  /** 初始化api，可放置json等静态文件 */
  readyapi?: string
  /** 携带指定的auth */
  auth?: Auth
}

const AppStore = hotcache('@SdkApps')

//  接口响应错误
export class AppError extends Error {
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
  static AppError = AppError
  // 转换app的请求
  public transformAppRequest(config: any) {
    // 转换url
    const api = config.api || config.url
    if (this.appid && !isAbsolute(api) && !isHttp(api)) {
      config.url = `/app/${this.appid}/${api}`
    } else {
      config.url = api
    }
    return config
  }
  // 转换app响应
  public async transformAppResponse(response: Response) {
    const json = await response.json()
    this.setHttpMessage('success', '')
    if (isHasOwn(json, 'code')) {
      if (json.code) throw new AppError(json.code, json.message, json.data, this) // 包含错误码则抛出错误
      this.setHttpMessage('success', json.message || json.msg)
      return json.data
    }
    return json
  }

  // @ts-ignore
  static instance: App = null

  public config!: Record<string, any>
  public setting!: Record<string, any>

  // 应用appid
  public readonly appid: string
  // 初始化接口
  public readyapi: string
  // 应用分析
  public analysisoff!: boolean

  public tasker!: ITaskerPromise<App>

  constructor (opts: IAppOption | string) {
    const option = isString(opts) ? { appid: opts } : opts
    const { appid = '', baseURL = Config.API_APP, auth = Auth.instance, readyapi = '', analysisoff = false } = option
    super({
      auth,
      // set app base api
      baseURL: baseURL,
      // set token
      transformRequest: (request) => this.transformAppRequest(request),
      // transform data
      transformResponse: (resposne) => this.transformAppResponse(resposne),
    })
    this.appid = appid
    this.readyapi = readyapi
    this.analysisoff = analysisoff
    this.config = {}
    this.setting = {}
    if (!(App.instance instanceof App)) {
      App.instance = this
    }
  }

  // 应用初始化
  public async ready (fn: any): Promise<App> {
    if (this.tasker) return this.tasker
    this.tasker = tasker<App>()
    const { appid } = this
    let { version, config, setting } = AppStore.get(appid, {}) as any
    try {
      const server = await this.get(this.readyapi, { version })
      if (version !== server.version) {
        config = server.config
        setting = server.setting
        AppStore.set(appid, server)
      }
      this.config = config
      this.setting = setting
      if (isFunction(fn)) fn(this)
      return await this.tasker.resolve(this)
    } catch (err) {
      return await this.tasker.reject(err)
    }
  }
}
