import store from '../adapters/store/index'
import { commonResponseReslove } from "../utils/common";
import { parse, stringify } from "../functions/qs";
import Http from "./Http";
import Auth from './Auth';
import User from './User';
import Tasker from './Tasker';
import config from '../config';
import { isAbsolute } from '../functions/path';
import { isHttp } from '../functions/is';

const noop: any = () => {}

/**
 * 一个页面一般只有一个应用（可通过`sdk.app`直接获取）
 * @class App
 */
export default class App {
  private static cacheKey: string = 'SdkApp'
  /** 实例 */
  private static _instance: App
  /** 获取应用实例 */
  public static get instance () {
    return this._instance
  }

  /** 全局的错误处理器 */
  public static errorHandler: errorHandler

  /** 是否有实例 */
  public static get hasInstance (): boolean {
    return !!this._instance
  }

  /** 创建默认实例（注意，重复创建将覆盖之前的默认实例） */
  public static createInstance (option: AppOption): App {
    if (this._instance) {
      console.warn('[App.instance] 已存在，此操作将覆盖默认实例')
    }
    return this._instance = new App(option)
  }

  // 全局样式控制器
  public static transformRequest = noop
  public static transformResponse = noop
  public static showLoading = noop
  public static showSuccess = noop
  public static showError = noop
  /** 是否已经登陆 */
  public get isLogin () {
    return this.user.isLogin
  }
  /** 是否需要授权 */
  public get isAuthed () {
    return this.auth.isAuthed
  }

  /** 已经注入用户认证信息的`Http`实例 */
  public http: Http
  /** auth信息 */
  public auth: Auth = Auth.instance
  /** 用户信息 */
  public user: User = User.instance
  /** 任务进度 */
  private tasker: Tasker = new Tasker

  /** 应用APPID */
  public appid: string = ''

  /** 服务端共用配置 */
  public config!: AppServerConfig
  /** 服务端设置项 */
  public setting!: AppServerSetting
  /** 是否启用分析系统 */
  public analysisoff?: boolean

  public constructor (app: AppOption) {
    const { appid, analysisoff } = app
    this.appid = appid
    this.analysisoff = analysisoff
    this.http = new Http({
      // 默认api路径
      baseURL: config.api + '/',
      /** 请求时带上appid和authorization */
      transformRequest: App.transformRequest.bind(this),
      /** 处理header中的authorization */
      transformResponse: App.transformResponse.bind(this)
    })
    // 执行初始化
    this.setup()
  }

  public setAuth (auth: Auth) {
    this.auth = auth
    this.user = auth.user
    return this
  }

  /**
   * 启动应用（只可调用一次）
   */
  public ready (fn?: any): Promise<any> {
    const auth = Auth.instance
    const preTaskList = [ this.tasker.task ]
    // 需要获取用户信息
    if (auth.isAuthed) {
      preTaskList.push(auth.tasker.task)
    }
    const task = Promise.all(preTaskList)
    if (typeof fn === 'function') {
      return task.then(fn.bind(this))
    }
    return task
  }

  /** 准备工作，获取应用配置以及用户信息 */
  private async setup () {
    const { tasker } = this
    if (tasker.isWorked) {
      return tasker.task
    }
    // 确保只执行一次
    tasker.working()
    let cache: AppServerInit | null = store.get(App.cacheKey)
    let version = ''

    // 应用缓存是否有效
    if (cache) {
      if (cache.config.appid === this.appid) {
        version = cache.version
      } else {
        cache = null
      }
    }
    const init = await this.get('init', { version })
    // 版本不统一时刷新缓存
    if (init.version !== version) {
      cache = init
      store.set(App.cacheKey, init)
    }
    // 保存应用属性
    if (cache) {
      this.setServer(cache)
    }
    return tasker.resolve(cache)
  }

  /** 设置应用配置和管理员设置 */
  private setServer (server: AppServerInit) {
    this.config = server.config
    this.setting = server.setting
  }

  // http train
  /** 发送应用请求POST */
  public post (action: string, data?: any) {
    return this.action(action, data, 'post')
  }
  /** 发送应用请求PUT */
  public put (action: string, data?: any) {
    return this.action(action, data, 'put')
  }
  /** 发送应用请求GET */
  public get (action: string, query?: any) {
    return this.action(action, query, 'get')
  }
  /** 发送应用请求DELETE */
  public delete (action: string, query?: any) {
    return this.action(action, query, 'delete')
  }
  /** 发送应用请求ACTION */
  public action (action: string | ActionStruct, param?: any, method: string = 'get') {
    let actionName: string
    let showError: MessageDialog = false
    let showLoading: MessageDialog = false
    let showSuccess: MessageDialog = false

    let loading: any
    if (typeof action === 'string') {
      actionName = action
    } else {
      // 支持对象方式
      actionName = action.api
      if (!actionName) {
        throw new TypeError(`参数错误未读取到api属性：${JSON.stringify(action)}`);
      }
      param = action.param || action.body || action.query
      showError = action.showError
      showLoading = action.showLoading
      showSuccess = action.showSuccess
    }
    // 使用ID主键操作
    if (typeof param === 'number') {
      param = { id: param }
    }

    if (showLoading) {
      if (typeof showLoading === 'function') {
        loading = showLoading('请稍后...', param)
        if (!loading || typeof loading.close !== 'function') {
          throw new TypeError(`showLoading() 返回值必须包含close()方法`);          
        }
      } else {
        loading = App.showLoading(showLoading)
      }
    }
    // 绝对路径判断
    let api: string
    if (isAbsolute(actionName)) {
      api = config.api + actionName
    } else if (isHttp(actionName)) {
      api = actionName
    } else {
      api = `app/${this.appid}/${actionName}`
    }
    const response = this.http[method](api, param).then(response => {
      loading && loading.close()
      // 成功
      if (!response.code && showSuccess) {
        if (typeof showSuccess === 'function') {
          showSuccess(response.message, response)
        } else {
          App.showSuccess(typeof showSuccess === 'string' ? showSuccess : response.message)
        }
      }
      return commonResponseReslove(response)
    }).catch((error: Error) => {
      loading && loading.close()
      if (showError) {
        if (typeof showError === 'function') {
          showError(error.message, error)
        }  else {
          App.showError(typeof showError === 'string' ? showError : error.message)
        }
      }
      return Promise.reject(error)
    })
    // 全局的错误捕获器
    if (typeof App.errorHandler === 'function') {
      return response.catch((err: Error) => App.errorHandler(err, {action: actionName, param, method}, this))
    }
    return response
  }
}

type MessageCallback = (msg?: string, response?: any) => any
type MessageDialog = boolean | string | MessageCallback

interface ActionStruct {
  api: string
  param: any
  body: any
  query: any
  showError: MessageDialog
  showLoading: MessageDialog
  showSuccess: MessageDialog
}

/** 应用配置 */
type AppServerConfig = {
  id: number
  name: string
  oauth: string
  appid: string
  endtime: number
  starttime: number
  status: string
}

/** 管理员配置 */
type AppServerSetting = Record<string, any>

/** 服务端返回的配置数据 */
export type AppServerInit = {
  /** 接口 */
  api: { [module: string]: string[] },
  /** 配置 */
  config: AppServerConfig,
  /** 设置 */
  setting: AppServerSetting,
  /** 版本 */
  version: string
}

/** 应用配置 */
export type AppOption = {
  /** 当前应用appid */
  appid: string
  /** API版本号 */
  version: string
  /** 默认开启分析系统，关闭设置为true */
  analysisoff?: boolean
}

/** 参数配置 */
type TypeAction = {
  method: string
  action: string
  param: any
}
/** 应用接口错误消息捕获 */
type errorHandler = (err: Error, action: TypeAction, vm: App) => void
