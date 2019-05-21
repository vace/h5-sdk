import { store } from '../plugins/store'
import { commonResponseReslove } from "../utils/shared";
import { parse, stringify } from "../functions/qs";
import Http from "./Http";
import UiModal from './UiModal';
import Oauth from './Oauth';
import User from './User';
import Tasker from './Tasker';
import { alway } from '../functions/common';
import config from '../config';

/**
 * 一个页面一般只有一个应用（可通过`sdk.app`直接获取）
 * @class App
 */
export default class App {
  private static cacheKey: string = 'SdkApp'
  /** 实例 */
  private static _instance: App
  /** 获取应用实例，`getInstance()`别名 */
  public static get instance () {
    return this.getInstance()
  }

  /** 全局的错误处理器 */
  public static errorHandler: errorHandler

  /** 获取应用实例 */
  public static getInstance (option?: AppOption) {
    if (!this._instance) {
      // 必须存在
      if (!option) {
        throw new Error('App.getInstance(option) 参数必须存在！')
      }
      this._instance = new App(option)
    }
    return this._instance
  }
  /** 是否已经登陆 */
  public get isLogin () {
    return User.instance.isLogin
  }

  /** 是否初始化 */
  public isInited: boolean = false

  /** 已经注入用户认证信息的`Http`实例 */
  public http: Http
  /** Oauth信息 */
  public oauth: Oauth = Oauth.instance
  /** 用户信息 */
  public user: User = User.instance
  /** 任务进度 */
  private tasker: Tasker = new Tasker

  /** 应用APPID */
  public appid: string = ''
  /** 当前应用版本号，用于拉取更新API */
  public version: string = '1.0.0'

  /** 服务端共用配置 */
  public config!: AppServerConfig
  /** 服务端设置项 */
  public setting!: AppServerSetting

  public constructor (app: AppOption) {
    const { appid, version } = app
    this.appid = appid
    this.version = version
    this.http = new Http({
      // 默认api路径
      baseURL: config.api,
      /** 请求时带上appid和authorization */
      transformRequest: option => {
        const { appid, oauth } = this
        const [host, queryString = ''] = option.url.split('?')
        const headers = <Headers> option.headers
        // 支持 {appid}/action 的格式
        if (host.indexOf(appid) === -1) {
          const query = parse(queryString)
          if (!query.appid) {
            query.appid = appid
            option.url = `${host}?${stringify(query)}`
          }
        }
        if (oauth.isAccessTokenValid && !headers.has('authorization')) {
          headers.set('authorization', <string> oauth.accessToken)
        }
        return option
      },
      /** 处理header中的authorization */
      transformResponse (response) {
        const authorize = response.headers.get('authorization')
        if (authorize) {
          Oauth.instance.saveToken(authorize)
        }
        return response.json().then((response) => {
          // -100 ~ -90为登陆错误
          if (response.code <= -90 && response.code > -100 ) {
            new UiModal({
              title: '用户信息已过期',
              content: '<div style="text-align:left;">您好，您的授权信息已经过期，请刷新页面重试，或点击下方重新登陆按钮重新授权~</div>',
              okText: '重新登陆',
              buttons: [
                {
                  label: '重新登陆',
                  onClick () {
                    Oauth.instance.redirect()
                  }
                }
              ]
            }).open()
          }
          return commonResponseReslove(response)
        })
      }
    })
    // 执行初始化
    this.setup()
  }

  /**
   * 启动应用（只可调用一次）
   */
  public ready (fn?: any): Promise<any> {
    const preTaskList = [
      Oauth.instance.tasker.task,
      this.tasker.task
    ]
    const task = Promise.all(preTaskList)
    if (typeof fn === 'function') {
      return task.then(fn.bind(this))
    }
    return task
  }

  /** 准备工作，获取应用配置以及用户信息 */
  private async setup () {
    this.isInited = true
    const version = this.version
    let cache: AppServerInit | null = store.get(App.cacheKey)
    if (cache) {
      const config = cache.config
      const isValid = config.appid === this.appid && cache.version === version
      if (!isValid) {
        cache = null
      }
    }
    if (!cache) {
      const cache = await this.get('init', { version })
      if (cache) {
        store.set(App.cacheKey, cache)
      }
    }
    // 保存应用属性
    if (cache) {
      this.setServer(cache)
    }
    return this.tasker.resolve(cache)
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
  public action (action: string, param?: any, method: string = 'get') {
    // 使用ID主键操作
    if (typeof param === 'number') {
      param = { id: param }
    }
    const api = `/app/${this.appid}/${action}`
    const response = this.http[method](api, param)
    // 全局的错误捕获器
    if (typeof App.errorHandler === 'function') {
      return response.catch((err: Error) => App.errorHandler(err, {action, param, method}, this))
    }
    return response
  }
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
}

/** 参数配置 */
type TypeAction = {
  method: string
  action: string
  param: any
}
/** 应用接口错误消息捕获 */
type errorHandler = (err: Error, action: TypeAction, vm: App) => void
