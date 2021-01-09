import { md5 } from '../plugins/safety'
import tasker, { ITaskerPromise } from '../plugins/tasker'
import { extname, isArray, isBase64, isDef, isHttp, isString, makeMap, once, resolvePath } from "../functions/common"
import Emitter from './Emitter'

/** 资源预加载处理 */
export type IResItem = {
  /** Res 地址 */
  url: string
  /** 别名 */
  key: string
  /** 种类 */
  type: string
  /** 传入文件名 */
  filename: string
}

export type IResLoader = (res: ResTask<any>) => Promise<any> | any

// 配置文件
export type IResOption = {
  baseURL?: string
  autoStart?: boolean
}

const enum ResTaskStatus {
  /** 元素被填写 */ ADDED, /** 加载中 */ LOADING, /** 已完成加载 */ LOADED, /** 加载失败 */FAILED
}

export class ResTask<T> {
  static STATUS_ADDED = ResTaskStatus.ADDED
  static STATUS_LOADING = ResTaskStatus.LOADING
  static STATUS_LOADED = ResTaskStatus.LOADED
  static STATUS_FAILED = ResTaskStatus.FAILED
  public tasker: ITaskerPromise<ResTask<T>> = tasker()

  public status: number = ResTaskStatus.ADDED
  public key: string
  public url: string
  public filename: string
  public type: string
  public options: any

  public data!: T
  public error!: Error
  // 可赋值的task，用户取消、监听进度等
  public task!: any

  public constructor (config: IResItem, options: any) {
    this.key = config.key || ''
    this.url = config.url
    this.filename = config.filename
    this.type = config.type
    this.options = options
  }

  // 释放资源
  public remove () {
    return Res.remove(this)
  }

  public doExec () {
    const loader = Res.getLoader(this.type)
    if (!loader) {
      const error = new TypeError('Res loader not existed: ' + this.type)
      this.status = ResTaskStatus.FAILED
      this.error = error
      this.tasker.reject(error)
      return this.tasker
    }
    this.status = ResTaskStatus.LOADING
    return loader(this).then((data: any) => {
      this.status = ResTaskStatus.LOADED
      this.data = data
      this.tasker.resolve(data)
      return this.tasker
    }).catch((error:Error) => {
      this.status = ResTaskStatus.FAILED
      this.error = error
      this.tasker.reject(error)
      return this.tasker
    })
  }
}

/** 加载进度 */
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

// 方法封装，具体实现由子类单独实现
export interface IResLoaderHook<T> {
  (item: string[] | IResItem[], option?: any): Promise<ResTask<T>[]>
  (item: string | IResItem, option?: any): Promise<ResTask<T>>
}

const ResEvent = makeMap(['progress', 'complete', 'added', 'loading', 'loaded', 'failed']) 

export default class Res extends Emitter {
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

  // 检查队列
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
      task.doExec().then(next).catch(next)
    }
  }
  /** 是否工作站 */
  public isWorked!: boolean
  /** 根路径 */
  public baseURL!: string
  /** 进度通知 */
  public progress: ResProgress = new ResProgress()
  /** 等待中队列 */
  protected $queue: ResTask<any>[] = []
  /** 全局任务 */
  protected $task: ITaskerPromise<Res> = tasker()

  /** 实例化 */
  public constructor (options: IResOption = {}) {
    super()
    this.baseURL = options.baseURL || ''
    this.isWorked = !!options.autoStart
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
    }
    return this.$task
  }
  public add<T>(item: string | IResItem, option?: any): ResTask<T>;
  public add<T>(item: string[] | IResItem[], option?: any): ResTask<T>[];

  public add (item: any, option?: any): any {
    // 支持添加资源数组
    if (isArray(item)) {
      return Promise.all((<any> item).map((i: string[] | IResItem[]) => this.add(i, option)))
    }
    item = (isString(item) ? { url: item } : item) as IResItem
    const cache = Res.$cache
    const config = _formatResStruct(item, this)
    const cacheKey = config.key
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, new ResTask(config, option))
    }
    const task = cache.get(cacheKey) as ResTask<any>
    return this._addTask(task)
  }

  /** 释放资源 */
  public remove (res: ResTask<any>) {
    return Res.remove(res)
  }

  /** 查找指定key资源 */
  public get (keyOrTask: string | ResTask<any>, _default?: any) {
    return Res.get(keyOrTask, _default)
  }

  /** 添加任务 */
  private _addTask (task: ResTask<any>) {
    this._nofify(ResTaskStatus.ADDED)
    if (this.isWorked) {
      this._execTask(task)
    } else {
      this.$queue.push(task)
    }
    task.tasker
      .then(() => this._nofify(ResTaskStatus.LOADED))
      .catch(() => this._nofify(ResTaskStatus.FAILED))
    return task.tasker
  }

  private _execTask (task: ResTask<any>) {
    this._nofify(ResTaskStatus.LOADING)
    Res.$queue.push(task)
    Res._watchExecTask()
  }

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
      if (progress.isComplete) {
        this.emit(ResEvent.complete, progress)
        this.$task.resolve(this)
      }
    }
  }

  /**
   * 扩展属性注解
   */
  arrayBuffer!: IResLoaderHook<ArrayBuffer>
  static arrayBuffer: IResLoaderHook<ArrayBuffer>
  blob!: IResLoaderHook<Blob>
  static blob: IResLoaderHook<Blob>
  headers!: IResLoaderHook<Headers>
  static headers: IResLoaderHook<Headers>
  json!: IResLoaderHook<any>
  static json: IResLoaderHook<any>
  text!: IResLoaderHook<string>
  static text: IResLoaderHook<string>
  formData!: IResLoaderHook<FormData>
  static formData: IResLoaderHook<FormData>
  jsonp!: IResLoaderHook<any>
  static jsonp: IResLoaderHook<any>
  css!: IResLoaderHook<HTMLStyleElement>
  static css: IResLoaderHook<HTMLStyleElement>
  js!: IResLoaderHook<HTMLScriptElement>
  static js: IResLoaderHook<HTMLScriptElement>
  img!: IResLoaderHook<HTMLImageElement>
  static img: IResLoaderHook<HTMLImageElement>
  crossimg!: IResLoaderHook<HTMLImageElement>
  static crossimg: IResLoaderHook<HTMLImageElement>
  audio!: IResLoaderHook<HTMLAudioElement>
  static audio: IResLoaderHook<HTMLAudioElement>
  video!: IResLoaderHook<HTMLVideoElement>
  static video: IResLoaderHook<HTMLVideoElement>
  download!: IResLoaderHook<any>
  static download: IResLoaderHook<any>
}

// 默认的格式映射，具体实现由各种平台子类控制
const putExtLoader = (loader: string, exts: string[]) => exts.forEach(ext => Res.extmaps[ext] = loader || ext)
putExtLoader('img', ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'])
putExtLoader('txt', ['html', 'md'])
putExtLoader('video', ['mp4', 'mov', 'webm'])
putExtLoader('audio', ['mp3', 'wav', 'ogg'])

// 注册快捷方式路由
function _bindLoaderMethod (type: string, useContext?: boolean) {
  return function (this: Res, res: string | string[] | IResItem | IResItem[], option?: any) {
    const context = useContext ? this : Res.instance
    // 支持批量加载
    if (isArray(res)) {
      return Promise.all((<any[]>res).map(item => context.add(_formatResStruct(item, context, type), option)))
    } else {
      return context.add(_formatResStruct(res, context, type), option)
    }
  }
}

const _formatResStruct = (res: string | IResItem, context?: Res, requireType?: string): IResItem => {
  const item = (isString(res) ? { url: res } : res) as IResItem
  let { url, type, key } = item
  let filename = url
  /** 强制类型，用于绑定加载器 */
  if (requireType) {
    type = requireType
  }
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
