import { md5 } from '../plugins/safety'
import tasker, { ITaskerPromise } from '../plugins/tasker'
import { extname, isArray, isBase64, isDef, isHttp, isString, makeMap, once, resolvePath } from "../functions/common"
import Emitter from './Emitter'
import { assign } from '../functions/common'

/** 资源预加载处理 */
export type IResItem = {
  /** Res 地址 */
  url: string
  /** 别名 */
  key?: string
  /** 种类 */
  type?: string
  /** 传入文件名 */
  filename?: string
}

/** 定义加载器实现 */
export type IResLoader = (res: ResTask<any>) => Promise<any> | any

/** 基础配置 */
export type IResOption = {
  /** 加载根目录 */
  baseURL?: string
  /** 当任务添加时，是否自动工作 */
  autoStart?: boolean
}

/** 元素任务状态 */
const enum ResTaskStatus {
  /** 被添加 */ ADDED, /** 加载中 */ LOADING, /** 已完成加载 */ LOADED, /** 加载失败 */FAILED
}

/** 加载任务 */
export class ResTask<T> {
  /** 资源被添加 */
  static STATUS_ADDED = ResTaskStatus.ADDED
  /** 资源加载中 */
  static STATUS_LOADING = ResTaskStatus.LOADING
  /** 资源已完成加载 */
  static STATUS_LOADED = ResTaskStatus.LOADED
  /** 资源加载失败 */
  static STATUS_FAILED = ResTaskStatus.FAILED
  /** 当前资源加载完成 */
  public finished: ITaskerPromise<ResTask<T>> = tasker()
  /** 当前资源加载状态 */
  public status: number = ResTaskStatus.ADDED
  /** 当前资源key */
  public key: string
  /** 当前应用路径 */
  public url: string
  /** 当前资源定义文件名 */
  public filename: string
  /** 当前资源种类 */
  public type: string
  /** 当前资源加载配置 */
  public options: any
  /** 当前资源加载成功后存储 */
  public data!: T
  /** 当前资源加载失败原因 */
  public error!: Error
  /** 资源加载任务，可用于用户取消、监听进度等 */
  public task!: any

  /**
   * 实例化资源
   * @param config 资源基础配置
   * @param options 资源配置
   */
  public constructor (config: IResItem, options: any) {
    this.key = config.key || ''
    this.url = config.url
    this.filename = <string> config.filename
    this.type = <string> config.type
    this.options = options
  }

  /** 资源加载成功通知 */
  public resolve () {
    return this.finished.resolve(this)
  }

  /** 资源加载失败通知 */
  public reject (err?: Error) {
    return this.finished.reject(err)
  }

  /** 资源加载成功后触发 */
  public onLoad (fn: (data: T) => any) {
    return this.finished.then(res => fn(res.data))
  }

  /** 资源加载失败后触发 */
  public onError (fn: (err: Error) => any) {
    return this.finished.catch(fn)
  }

  /** 释放当前资源 */
  public remove () {
    return Res.remove(this)
  }

  /** 加载资源 */
  public doLoad () {
    const loader = Res.getLoader(this.type)
    if (!loader) {
      const error = new TypeError('Res loader not existed: ' + this.type)
      this.status = ResTaskStatus.FAILED
      this.error = error
      this.reject(error)
      return this.finished
    }
    this.status = ResTaskStatus.LOADING
    return loader(this).then((data: any) => {
      this.status = ResTaskStatus.LOADED
      this.data = data
      this.resolve()
      return this.finished
    }).catch((error:Error) => {
      this.status = ResTaskStatus.FAILED
      this.error = error
      this.reject(error)
      return this.finished
    })
  }
}

/**
 * 加载进度实例
 */
class ResProgress {
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
  /** 是否加载完成 */
  public get isComplete() {
    return this.total === this.current
  }
  /** 可获取0-100之间的百分比数字 */
  public get percent(): number {
    return (this.current / this.total) * 100
  }
}

/** 方法封装，具体实现由子类单独实现 */
export interface IResLoaderHook<T> {
  (item: string[] | IResItem[], option?: any): Promise<ResTask<T>[]>
  (item: string | IResItem, option?: any): Promise<ResTask<T>>
}

/** 事件集合 */
const ResEvent = makeMap(['progress', 'complete', 'added', 'loading', 'loaded', 'failed']) 

/**
 * 资源加载处理器
 */
export default class Res extends Emitter {
  /** 全局配置 */
  public static config: IResOption = {}
  /** 任务实例 */
  public static ResTask = ResTask
  /** 进度实例 */
  public static ResProgress = ResProgress
  /** 默认实例 */
  public static instance = new Res({ autoStart: true })
  /** 加载控制器 */
  public static loaders: Map<string, IResLoader> = new Map()
  /** 全局ext自动查找，根据请求文件名自动查找对应加载器 */
  public static extmaps = {}
  /** 注册加载控制器 */
  public static registerLoader(type: string, loader: IResLoader): typeof Res {
    if (this.loaders.has(type)) {
      console.warn(`Res loader is exsited:`, type)
    }
    this.loaders.set(type, loader)
    // 注册快捷方式
    this[type] = _bindLoaderMethod(type)
    // 原型链注册
    Res.prototype[type] = _bindLoaderMethod(type, true)
    return this
  }
  /** 查询加载控制器 */
  public static getLoader (type: string) {
    const loader = Res.loaders.get(type)
    return loader
  }
  /** 全局队列 */
  private static $queue: ResTask<any>[] = []
  /** 全局可设置的并发加载量，0为不限量 */
  private static $concurrency = 10
  /** 当前正在加载的数量 */
  private static $pending: number = 0
  /** 全局缓存 */
  private static $cache: Map<string, ResTask<any>> = new Map
  /** 释放资源 */
  public static remove (res: ResTask<any>) {
    return this.$cache.delete(res.key)
  }
  /** 查找指定key资源 */
  public static get (keyOrTask: string | ResTask<any>, _default?: any): any {
    const task = this.$cache.get(isString(keyOrTask) ? keyOrTask : keyOrTask.key)
    return task && isDef(task.data) ? task.data : _default
  }
  /** 全局方法，添加资源 */
  public static add (item: any, option?: any) {
    return Res.instance.add(item, option)
  }
  /** @private 检查队列 */
  private static _watchExecTask () {
    const { $pending, $concurrency, $queue } = Res
    if ($concurrency > 0 && $pending >= $concurrency || !$queue.length) return
    const task = $queue.shift()
    if (task) {
      const next = once(() => {
        Res.$pending -= 1
        Res._watchExecTask()
      })
      Res.$pending += 1
      task.doLoad().then(next).catch(next)
    }
  }
  /** 是否工作中 */
  public isWorked!: boolean
  /** 根路径 */
  public baseURL!: string
  /** 进度通知 */
  public progress: ResProgress = new ResProgress()
  /** 全局加载任务(仅在第一次start-complete后触发) */
  public finished: ITaskerPromise<Res> = tasker()
  /** 等待中队列 */
  protected $queue: ResTask<any>[] = []

  /**
   * 资源加载器
   * @param options 加载器全局配置
   */
  public constructor (options: IResOption = {}) {
    super()
    const opts = assign({}, Res.config, options)
    this.baseURL = opts.baseURL || ''
    this.isWorked = !!opts.autoStart
  }

  /** 开始任务 */
  public start () {
    const { isWorked, $queue } = this
    if (!isWorked) {
      this.isWorked = true
    }
    if ($queue.length) {
      for (const task of $queue) this._execTask(task)
      $queue.length = 0
    } else {
      this._checkComplete()
    }
    return this.finished
  }
  public add<T>(item: string | IResItem, option?: any): ResTask<T>;
  public add<T>(item: string[] | IResItem[], option?: any): ResTask<T>[];
  /**
   * 添加任务到队列，添加数组时返回任务数组，添加单项时返回任务自身
   * @param item 资源项目或列表
   * @param option 资源加载配置
   */
  public add<T>(item: string | IResItem | string[] | IResItem[], option?: any): ResTask<T> | ResTask<T>[] {
    // 支持添加资源数组
    if (isArray(item)) {
      return (<any>item).map((i: string[] | IResItem[]) => this.add(i, option))
    }
    item = (isString(item) ? { url: item } : item) as IResItem
    const cache = Res.$cache
    const config = _formatResStruct(item, this)
    const cacheKey = <string> config.key
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, new ResTask(config, option))
    }
    const task = cache.get(cacheKey) as ResTask<T>
    this._nofify(ResTaskStatus.ADDED)
    if (this.isWorked) {
      this._execTask(task)
    } else {
      this.$queue.push(task)
    }
    task.finished
      .then(() => this._nofify(ResTaskStatus.LOADED))
      .catch(() => this._nofify(ResTaskStatus.FAILED))
    return task
  }

  /** 释放资源 */
  public remove (res: ResTask<any>) {
    return Res.remove(res)
  }

  /** 查找指定key资源 */
  public get (keyOrTask: string | ResTask<any>, _default?: any) {
    return Res.get(keyOrTask, _default)
  }
  /** @private 执行指定任务 */
  private _execTask (task: ResTask<any>) {
    this._nofify(ResTaskStatus.LOADING)
    Res.$queue.push(task)
    Res._watchExecTask()
  }
  /** @private 进度通知 */
  private _nofify(status: ResTaskStatus) {
    const progress = this.progress
    if (status === ResTaskStatus.ADDED) {
      progress.total += 1
      this.emit(ResEvent.added, progress)
    } else if (status === ResTaskStatus.LOADING) {
      progress.pending += 1
      this.emit(ResEvent.loading, progress)
    } else if (status === ResTaskStatus.LOADED) {
      progress.pending -= 1
      progress.loaded += 1
      progress.current += 1
      this.emit(ResEvent.loaded, progress)
    } else if (status === ResTaskStatus.FAILED) {
      progress.pending -= 1
      progress.failed += 1
      progress.current += 1
      this.emit(ResEvent.failed, progress)
    }
    if (status === ResTaskStatus.FAILED || status === ResTaskStatus.LOADED) {
      this.emit(ResEvent.progress, progress)
      this._checkComplete()
    }
  }
  /** @private 检测任务是否加载完成 */
  private _checkComplete () {
    const progress = this.progress
    const isComplete = progress.isComplete
    if (isComplete) {
      this.emit(ResEvent.complete, progress)
      this.finished.resolve(this)
    }
    return isComplete
  }

  /**
   * 扩展属性注解
   */
  /** 加载arrayBuffer资源 */
  arrayBuffer!: IResLoaderHook<ArrayBuffer>
  /** 加载arrayBuffer类型资源（使用全局加载器） */
  static arrayBuffer: IResLoaderHook<ArrayBuffer>
  /** 加载blob资源 */
  blob!: IResLoaderHook<Blob>
  /** 加载blob类型资源（使用全局加载器） */
  static blob: IResLoaderHook<Blob>
  /** 加载headers资源 */
  headers!: IResLoaderHook<Headers>
  /** 加载headers类型资源（使用全局加载器） */
  static headers: IResLoaderHook<Headers>
  /** 加载json资源 */
  json!: IResLoaderHook<any>
  /** 加载json类型资源（使用全局加载器） */
  static json: IResLoaderHook<any>
  /** 加载text资源 */
  text!: IResLoaderHook<string>
  /** 加载text类型资源（使用全局加载器） */
  static text: IResLoaderHook<string>
  /** 加载formData资源 */
  formData!: IResLoaderHook<FormData>
  /** 加载formData类型资源（使用全局加载器） */
  static formData: IResLoaderHook<FormData>
  /** 加载jsonp资源 */
  jsonp!: IResLoaderHook<any>
  /** 加载jsonp类型资源（使用全局加载器） */
  static jsonp: IResLoaderHook<any>
  /** 加载css资源 */
  css!: IResLoaderHook<HTMLStyleElement>
  /** 加载css类型资源（使用全局加载器） */
  static css: IResLoaderHook<HTMLStyleElement>
  /** 加载js资源 */
  js!: IResLoaderHook<HTMLScriptElement>
  /** 加载js类型资源（使用全局加载器） */
  static js: IResLoaderHook<HTMLScriptElement>
  /** 加载img资源 */
  img!: IResLoaderHook<HTMLImageElement>
  /** 加载img类型资源（使用全局加载器） */
  static img: IResLoaderHook<HTMLImageElement>
  /** 加载crossimg资源 */
  crossimg!: IResLoaderHook<HTMLImageElement>
  /** 加载crossimg类型资源（使用全局加载器） */
  static crossimg: IResLoaderHook<HTMLImageElement>
  /** 加载audio资源 */
  audio!: IResLoaderHook<HTMLAudioElement>
  /** 加载audio类型资源（使用全局加载器） */
  static audio: IResLoaderHook<HTMLAudioElement>
  /** 加载video资源 */
  video!: IResLoaderHook<HTMLVideoElement>
  /** 加载video类型资源（使用全局加载器） */
  static video: IResLoaderHook<HTMLVideoElement>
  /** 加载download资源 */
  download!: IResLoaderHook<any>
  /** 加载download类型资源（使用全局加载器） */
  static download: IResLoaderHook<any>
}

// 默认的格式映射，具体实现由各种平台子类控制
const putExtLoader = (loader: string, exts: string[]) => exts.forEach(ext => Res.extmaps[ext] = loader || ext)
putExtLoader('img', ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'])
putExtLoader('text', ['html', 'md', 'txt', 'csv'])
putExtLoader('video', ['mp4', 'mov', 'webm'])
putExtLoader('audio', ['mp3', 'wav', 'ogg'])

// 注册快捷方式路由
function _bindLoaderMethod (type: string, useContext?: boolean) {
  const bindResType = (item: any) => {
    if (isString(item)) return { type, url: item }
    else if (item) item.type = type
    return item
  }
  return function (this: Res, res: any | any[], option?: any) {
    const context = useContext ? this : Res.instance
    // 支持批量加载
    if (isArray(res)) {
      const tasks = res.map(item => context.add(bindResType(item), option).finished)
      return Promise.all(tasks)
    } else {
      return context.add(bindResType(res), option).finished
    }
  }
}

const _formatResStruct = (res: string | IResItem, context?: Res): IResItem => {
  const item = (isString(res) ? { url: res } : res) as IResItem
  let { url, type, key } = item
  let filename = url
  if (!type) {
    // 资源中包含?时可能表示版本信息，过滤此信息
    const ext = extname(url.split('?')[0]).slice(1).toLowerCase()
    type = Res.extmaps[ext] || ext || 'text'
  }
  if (context && context.baseURL) {
    if (!isHttp(url) && !isBase64(url)) {
      url = context.baseURL + url
    }
  }
  if (!key) {
    key = type + ':' + (url.length > 1024 * 10 ? md5(url) : url)
  }
  return { url, type, key, filename }
}
