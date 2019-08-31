import { assign } from 'es6-object-assign'

import { each } from '../functions/underscore';
import { document } from '../utils/global';
import { isHttp, isBase64 } from '../functions/is';
import Emitter from './Emitter';
import { isAbsolute } from '../functions/path';
import { uuid } from '../functions/common';
import { isIos } from '../functions/index';

/**
 * ```javascript
 * const res = new Res()
 * res.push('a.png').push('b.png')
 * res.push('data.json', 'JSON')
 * 
 * ```
 */

/** 默认支持的资源种类 */
export enum TYPE {
  /** 未知类型，不处理，直接返回Response */
  UNKNOWN = 'none',
  /** arrayBuffer */
  ARRAY_BUFFER = 'arrayBuffer',
  /** blob */
  BLOB = 'blob',
  /** 只获取headers */
  HEADERS = 'headers',
  /** 尝试解析json */
  JSON = 'json',
  /** 尝试以text读取 */
  TEXT = 'text',
  /** 尝试读取formData */
  FORM_DATA = 'formData',
  /** 加载CSS文件 */
  CSS = 'css',
  /** 加载JS文件 */
  JS = 'js',
  /** 加载图片文件 */
  IMG = 'img',
  /** 加载AUDIO文件 */
  AUDIO = 'audio',
  /** 加载VIDEO文件 */
  VIDEO = 'video'
}

export enum STATUS {
  /** 元素被填写 */
  ADDED,
  /** 加载中 */
  LOADING,
  /** 已完成加载 */
  LOAEED,
  /** 加载失败 */
  FAILED
}

/** 加载进度 */
export class ResProgress {
  /** 总数 */
  public total: number = 0
  /** 当前第多少个 */
  public current: number = 0
  /** 等待中多少个 */
  public pending: number = 0
  /** 已加载多少个 */
  public loaded: number = 0
  /** 加载失败多少个 */
  public failed: number = 0

  /** target */
  public $bus!: Res

  /** 是否加载完成 */
  public get isComplete () {
    return this.total === this.current
  }
  /** 可获取0-100之间的百分比数字 */
  public get percent (): number {
    return (this.current / this.total) * 100
  }
  /** 清空计数器，一般用于二次加载的需求 */
  public clear () {
    this.total = this.current = this.pending = this.loaded = this.failed = 0
    this.$notify('clear')
  }
  /** 分发加载事件 */
  public $notify (event: IResEvent) {
    if (this.$bus) {
      this.$bus.emit(event, this)
    }
  }
  /** 增加一项资源 */
  public $added () {
    this.total += 1
    this.$notify('push')
  }
  /** 开始加载 */
  public $pending () {
    this.pending += 1
    this.$notify('pending')
  }
  /** 加载成功 */
  public $loaded () {
    this.pending -= 1
    this.current += 1
    this.loaded += 1
    this.$notify('progress')
    this.$notify('success')
    if (this.isComplete) {
      this.$notify('complete')
    }
  }
  /** 加载失败 */
  public $failed () {
    this.pending -= 1
    this.current += 1
    this.failed += 1
    this.$notify('progress')
    this.$notify('fail')
    if (this.isComplete) {
      this.$notify('complete')
    }
  }
}

/** 资源管理器 */
export default class Res extends Emitter{
  /** 全局可设置的并发加载量，0为不限量 */
  public static concurrency = 10

  private static pending: number = 0
  private static _taskList: IResourceStruct[] = []
  /** 资源ID */
  public static id: number = 0
  /** 进度实例 */
  public static Progress: typeof ResProgress = ResProgress
  /** 默认配置 */
  public static config: IResConfig = {
    autoStart: false,
    root: '',
    defaultType: TYPE.UNKNOWN
  }
  /** 加载任务缓存 */
  public static cache: Record<string, IResourceStruct> = Object.create(null)
  /** 默认实例缓存 */
  protected static _instance: Res
  /** 获取默认实例 */
  public static get instance(): Res {
    if (!this._instance) {
      this._instance = new Res({ autoStart: true })
    }
    return this._instance
  }
  /** Loader 列表 */
  public static loaders: Map<string, LoaderHandle> = new Map()
  /** 注册Loader */
  public static registerLoader(this: any, type: string, handle: LoaderHandle): typeof Res {
    this.loaders.set(type, handle)
    // 注册快捷方式
    this[type] = bindLoaderMethod(type, Res.instance)
    // 原型链注册
    Res.prototype[type] = bindLoaderMethod(type)
    return this
  }
  /** 读取已注册的Loader */
  public static getLoader(type: string): LoaderHandle {
    const loader = this.loaders.get(type)
    if (!loader) {
      throw new TypeError(`Res Type '${type}' Not Existed`)
    }
    return loader
  }

  /** 根据文件的key或者任务ID读取资源项目 */
  public static get (key: string | number): IResourceStruct {
    return this.cache[key]
  }

  /** 实例配置 */
  public config: IResConfig

  /** 是否开始加载 */
  public isStart: boolean = false
  /** 是否正在工作，加载队列完成后=false */
  public isWorking: boolean = false
  /** 操作进度 */
  public progress: ResProgress = new ResProgress
  /** start后触发 */
  public isExecuted: boolean = false

  /** 加载队列 */
  public tasks: IResourceStruct[] = []
  /** 当前实例缓存 */
  public cache: Record<string, IResourceStruct> = Object.create(null)

  /** 绑定资源加载事件 */
  private _onResLoaded!: any
  private _onResFailed!: any

  /** 队列是否完全加载 */
  public get isComplete () {
    return this.isExecuted && this.progress.isComplete
  }

  /** 初始化 */
  public constructor(option?: IResConfig) {
    super()
    this.config = assign({}, Res.config, option)
    this._onResLoaded = this.__resCb.bind(this, true)
    this._onResFailed = this.__resCb.bind(this, false)
    // 绑定进度实例
    this.progress.$bus = this
    if (this.config.autoStart) {
      this.start()
    }
  }
  /** 开始加载 */
  public start() {
    const { progress, tasks } = this
    if (this.isStart) {
      return this
    }
    this.isExecuted = true
    this.isStart = true
    this.progress.$notify('start')
    // 队列中没有任务，直接通知完成
    if (this.isComplete) {
      progress.$notify('complete')
    } else {
      while (tasks.length) {
        this.pushRes(tasks.shift() as IResourceStruct)
      }
    }
    return this
  }
  /** 暂停加载 */
  public pause() {
    if (this.isStart) {
      this.isStart = false      
      this.progress.$notify('paused')
    }
    return this
  }
  /** 读取资源 */
  public get (key: string | number): IResourceStruct {
    return Res.get(key)
  }
  /** 追加资源 */
  public add(res: IResPushStruct, option?: any) {
    const { config: { root, defaultType } } = this
    let { key, url, type = defaultType } = res
    // 绝对路径以及http不处理
    if (isAbsolute(url) || isHttp(url)) {
      // 无需处理
    } else if (isBase64(url)) {
      // base64需要计算key，如果不提供，则默认生成一个uuid防止生成过长的索引
      if (!key) {
        key = uuid()
      }
    } else if (root){
      url = root + url // 默认前缀处理
    }
    // 完整的url
    key = key || url
    if (typeof key !== 'string') {
      throw new TypeError(`Res key 必须为字符串`);
    }
    /** 资源缓存KEY */
    let item: IResourceStruct = Res.cache[key]
    // 命中缓存
    if (item) {
      // 缓存不一致
      if (item.type !== type || item.url !== url) {
        throw new Error('资源：' + key + ' 已经存在，但种类和URL不匹配！')
      }
    } else {
      let _resolve: Function, _reject: any
      const promise = new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
      })
      // 任务调度处理
      const task = promise as IResourceTask
      task.id = ++Res.id
      task.exec = () => {
        const loader = Res.getLoader(item.type)
        item.status = STATUS.LOADING
        return loader(item.url, item.option).then(data => {
          item.status = STATUS.LOAEED
          item.data = data
          return _resolve(item)
        }, err => {
          item.status = STATUS.FAILED
          item.error = err
          return _reject(err)
        })
      }
      // 新建任务
      item = {
        id: task.id, key, url, type: type as string, status: STATUS.ADDED, data: null, task, option,
        get isLoading () {
          return this.status === STATUS.LOADING
        },
        get isLoaded () {
          return this.status === STATUS.LOAEED
        },
        get isFailed () {
          return this.status === STATUS.FAILED
        }
      }
      // 根据任务缓存
      Res.cache[key] = Res.cache[task.id] = item
    }
    const task = item.task
    // 加入到当前队列中
    const { isStart, cache } = this
    
    if (!cache[key]) {
      cache[key] = item
      this.progress.$added()
      // 加载事件监听
      item.task.then(this._onResLoaded, this._onResFailed)
      if (isStart) {
        this.pushRes(item)
      } else {
        this.tasks.push(item)
      }
    }
    return task
  }

  /** 添加一个任务到加载队列 */
  public pushRes (res: IResourceStruct) {
    const { concurrency, pending, _taskList } = Res
    // 未达到加载上限时直接加载
    if (!concurrency || concurrency > pending) {
      const progress = this.progress
      Res.pending += 1
      progress.$pending()
      // 用于处理剩余队列
      if (res.status === STATUS.ADDED) {
        res.task.exec()
      }
    } else {
      _taskList.push(res)
    }
  }
  /** 清空加载队列，一般用于重新加载 */
  public clear () {
    this.isStart = false
    this.progress.clear()
    this.isExecuted = false
  }
  /** 资源项加载完毕处理 */
  private __resCb (isLoaded: boolean) {
    const progress = this.progress
    Res.pending -= 1
    if (isLoaded) {
      progress.$loaded()
    } else {
      progress.$failed()
    }
    if (Res._taskList.length) {
      this.pushRes(<any> Res._taskList.shift())
    } else {
      this.isWorking = false
    }
  }
}

// register xhr res handle
[TYPE.UNKNOWN, TYPE.ARRAY_BUFFER, TYPE.BLOB, TYPE.HEADERS, TYPE.JSON, TYPE.TEXT, TYPE.FORM_DATA].forEach(type => {
  Res.registerLoader(type, (url, option) => fetch(url, option).then((res: any) => {
    if (type in res) {
      return typeof res[type] === 'function' ? res[type]() : res[type]
    }
    return res
  }))
});

// register document element handle
[TYPE.CSS, TYPE.JS, TYPE.IMG, TYPE.AUDIO, TYPE.VIDEO].forEach(type => {
  Res.registerLoader(type, (url, option) => new Promise((resolve, reject) => {
    let eventResolve: null | 'onload' | 'oncanplaythrough' | 'oncanplay' = 'onload'
    /** 是否插入文档 */
    let isInsertDocument: boolean = false
    /** 标签别名 */
    let tagName: string = type
    let _option
    if (type === TYPE.CSS) {
      tagName = 'link'
      isInsertDocument = true
      _option = { rel: 'stylesheet', href: url }
    }
    else if (type === TYPE.JS) {
      tagName = 'script'
      isInsertDocument = true
      _option = { src: url, async: true }
    }
    else if (type === TYPE.IMG) {
      _option = { src: url }
    }
    else if (type === TYPE.AUDIO || type === TYPE.VIDEO) {
      // ios 不支持canplay
      eventResolve = isIos ? null : 'oncanplay'
      _option = { src: url }
    }
    const element = document.createElement(tagName)
    element.onerror = reject
    each(assign(_option, option), (val: string, key: string) => element.setAttribute(key, val))
    // 绑定事件
    if (eventResolve) {
      element[eventResolve] = () => resolve(element)
    } else {
      // 不支持则直接返回
      resolve(element)
    }
    if (isInsertDocument) {
      const inserted = document.head || document.documentElement
      inserted.insertAdjacentElement('beforeend', element)
    }
  }))
})

/** 定义插件解析体系 */

// Res.registerLoader('plugin', (url, option) => new Promise(resolve => {
// 
// }))

/** 配置文件 */
export type IResConfig = {
  /** 根目录 */
  root?: string
  /** 默认类型 */
  defaultType?: string,
  /** 是否自动开始 */
  autoStart?: boolean
}

/** 资源预加载处理 */
export type IResPushStruct = {
  /** Res 地址 */
  url: string
  /** 别名 */
  key?: string
  /** 种类 */
  type?: string
}

/** Loader Handle */
type LoaderHandle = (url: string, option?: any) => Promise<any>

/** 资源结构 */
export type IResourceStruct = {
  /** 资源ID */
  id: number
  /** 唯一KEY */
  key: string
  /** 加载链接 */
  url: string
  /** 资源种类 */
  type: string
  /** 加载状态 */
  status: STATUS
  /** 加载的数据 */
  data: any
  /** 状态信息 */
  readonly isLoading: boolean
  readonly isLoaded: boolean
  readonly isFailed: boolean
  /** 任务 */
  task: IResourceTask
  /** 任务参数 */
  option: any
  /** 错误信息，出错时包含 */
  error?: any
}

export interface IResourceTask extends Promise<IResourceStruct> {
  id: number,
  exec: (a?: IResourceStruct) => void
}

/** 事件通知 */
export type IResEvent = 'push' | 'pending' | 'success' | 'complete' | 'fail' | 'clear' | 'progress' | 'start' | 'paused'

// 注册快捷方式路由
function bindLoaderMethod (type: string, context?: any) {
  return function (this: any, res: string | any[] | IResPushStruct, option?: any) {
    context = context || this
    // 支持批量加载
    if (Array.isArray(res)) {
      const taskList = res.map((item) => {
        if (typeof item === 'string') {
          item = { url: item }
        }
        item.type = type
        return context.add(item, option)
      })
      return Promise.all(taskList)
    }
    if (typeof res === 'string') {
      res = { url: res }
    }
    res.type = type
    return context.add(res, option)
  }
}
