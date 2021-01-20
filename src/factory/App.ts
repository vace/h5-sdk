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

/**
 * 应用返回值处理
 */
export class AppError extends Error {
  /** 错误代码 */
  public code: number
  /** 错误数据 */
  public data: number
  /** 绑定实例 */
  public app: App
  constructor(code: number, message: string, data: any, app: App) {
    super(message)
    this.code = code
    this.data = data
    this.app = app
  }
}

/**
 * 实例化App对象
 */
export default class App extends Http {
  /** APP 响应错误 */
  static AppError = AppError
  /** 转换app的请求 */
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
  /** 转换app响应 */
  public async transformAppResponse(response: Response) {
    const json = await response.json()
    this.setHttpMessage('success', '')
    if (isHasOwn(json, 'code')) {
      const { code, message, data } = json
      if (code) throw new AppError(code, message, data, this) // 包含错误码则抛出错误
      this.setHttpMessage('success', message || '')
      return data
    }
    return json
  }

  /** 当前应用实例(如果有多个实例，只能获取第一个) */
  // @ts-ignore
  static instance: App = null
  /** 当前应用基本配置， */
  public config: IAppConfig
  /** 当前应用定义的配置 */
  public setting!: Record<string, any>
  /** 应用appid */
  public readonly appid: string
  /** 初始化接口 */
  public readyapi: string
  /** 是否启用应用分析 */
  public analysisoff!: boolean
  /** 应用初始化完成事件 */
  public finished!: ITaskerPromise<App>

  /**
   * @param opts app配置或者appid
   */
  constructor (opts: IAppOption | string) {
    const option = isString(opts) ? { appid: opts } : opts
    const { appid = '', baseURL = Config.API_APP, auth = Auth.instance, readyapi = 'init', analysisoff = false } = option
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
    this.config = <any>{}
    this.setting = <any>{}
    if (!(App.instance instanceof App)) {
      App.instance = this
    }
  }

  /** 应用初始化 */
  public async ready (fn?: (app: App) => any): Promise<App> {
    if (this.finished) return this.finished
    this.finished = tasker<App>()
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
      return this.finished.resolve(this)
    } catch (err) {
      return this.finished.reject(err)
    }
  }
}

/** 应用全局配置 */
export interface IAppConfig {
  /** 应用ID */
  id:         number;
  /** 应用appid */
  appid:      string;
  /** 应用名称 */
  name:       string;
  /** 应用接入点 */
  endpoint:   string;
  /** 应用要求授权种类：none=无授权,base=基础授权,user=用户授权,custom=自定义授权 */
  oauth:      'none' | 'base' | 'user' | 'custom';
  /** 应用开始时间 */
  starttime:  number;
  /** 应用结束时间 */
  endtime:    number;
  /** 应用状态：normal=正常,paused=暂停,overdue=下线 */
  status:     'normal' | 'paused' | 'overdue';
  /** 应用更新时间 */
  updatetime: number;
}
