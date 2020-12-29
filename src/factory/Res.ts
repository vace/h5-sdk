import { md5 } from '../plugins/safety'
import { extname, isArray, isBase64, isDef, isHttp, isString, makeMap, once } from "../functions/common"
import Tasker from './Tasker'
import Emitter from './Emitter'

/** 资源预加载处理 */
export type IResItem = {
  /** Res 地址 */
  url: string
  /** 别名 */
  key: string
  /** 种类 */
  type: string
}

export type IResLoader = (res: ResTask) => Promise<any> | any

// 配置文件
export type IResOption = {
  baseURL?: string
  autoStart?: boolean
}

enum ResTaskStatus {
  /** 元素被填写 */ ADDED, /** 加载中 */ LOADING, /** 已完成加载 */ LOADED, /** 加载失败 */FAILED
}

class ResTask extends Tasker{
  static STATUS_ADDED = ResTaskStatus.ADDED
  static STATUS_LOADING = ResTaskStatus.LOADING
  static STATUS_LOADED = ResTaskStatus.LOADED
  static STATUS_FAILED = ResTaskStatus.FAILED

  public status: number = ResTaskStatus.ADDED

  public key: string
  public url: string
  public type: string
  public options: any

  public data!: any
  public error!: Error
  // 可赋值的task，用户取消、监听进度等
  public task!: any

  public constructor (config: IResItem, options: any) {
    super()
    this.key = config.key || ''
    this.url = config.url
    this.type = config.type
    this.options = options
    this.onLoaded = this.onLoaded.bind(this)
    this.onError = this.onError.bind(this)
  }

  // 释放资源
  public remove () {
    return Res.remove(this)
  }

  public doExec () {
    const loader = Res.getLoader(this.type)
    if (!loader) {
      const error = new TypeError('Res loader not existed: ' + this.type)
      console.warn(error)
      return this.onError(error)
    }
    this.status = ResTaskStatus.LOADING
    return loader(this).then(this.onLoaded).catch(this.onError)
  }

  public onLoaded (data: any) {
    this.status = ResTaskStatus.LOADED
    this.data = data
    this.resolve(data)
    return this
  }

  public onError (error: Error) {
    this.status = ResTaskStatus.FAILED
    this.error = error
    this.reject(error)
    return this
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
  private static $queue: ResTask[] = []
  /** 全局可设置的并发加载量，0为不限量 */
  private static $concurrency = 10
  /** 当前正在加载的数量 */
  private static $pending: number = 0
  /** 全局缓存 */
  private static $cache: Map<string, ResTask> = new Map

  /** 释放资源 */
  public static remove (res: ResTask) {
    return this.$cache.delete(res.key)
  }

  /** 查找指定key资源 */
  public static get (keyOrTask: string | ResTask, _default?: any): any {
    const task = this.$cache.get(isString(keyOrTask) ? keyOrTask : keyOrTask.key)
    return task && isDef(task.data) ? task.data : _default
  }

  // 检查队列
  private static _watchQueue () {
    const { $pending, $concurrency, $queue } = Res
    if ($concurrency > 0 && $pending >= $concurrency || !$queue.length) return
    const task = $queue.shift()
    if (task) {
      const next = once(() => {
        Res.$pending -= 1
        Res._watchQueue()
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
  protected $queue: ResTask[] = []
  /** 全局任务 */
  protected $task = new Tasker()

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
      for (const task of $queue) this._putResQueue(task)
      $queue.length = 0
    }
    return this.$task
  }

  public add (item: string | string[] | IResItem | IResItem[], option?: any) {
    // 支持添加资源数组
    if (isArray(item)) {
      return Promise.all((<any> item).map((i: string[] | IResItem[]) => this.add(i, option)))
    }
    item = (isString(item) ? { url: item } : item) as IResItem
    const { baseURL } = this
    let { url, type, key } = item
    if (!isHttp(url) && !isBase64(url)) url = baseURL + url
    const cache = Res.$cache
    const config = _formatResStruct({ url, type, key })
    const cacheKey = config.key
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, new ResTask(config, option))
    }
    const task = cache.get(cacheKey) as ResTask
    return this._addTask(task)
  }

  /** 释放资源 */
  public remove (res: ResTask) {
    return Res.remove(res)
  }

  /** 查找指定key资源 */
  public get (keyOrTask: string | ResTask, _default?: any) {
    return Res.get(keyOrTask, _default)
  }

  /** 添加任务 */
  private _addTask (task: ResTask) {
    this._nofify(ResTaskStatus.ADDED)
    if (this.isWorked) {
      this._putResQueue(task)
    } else {
      this.$queue.push(task)
    }
    this._watchTask(task)
    return task
  }

  private _putResQueue (task: ResTask) {
    this._nofify(ResTaskStatus.LOADING)
    Res.$queue.push(task)
    Res._watchQueue()
  }

  private _watchTask (task: ResTask) {
    return task
      .then(() => this._nofify(ResTaskStatus.LOADED))
      .catch(() => this._nofify(ResTaskStatus.FAILED))
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
        // start 返回监听队列回调
        if (!this.$task.isResolved) {
          this.$task.resolve(this)
        }
      }
    }
  }
}

// 默认的格式映射，具体实现由各种平台子类控制
const putExtLoader = (loader: string, exts: string[]) => exts.forEach(ext => Res.extmaps[ext] = loader || ext)
putExtLoader('img', ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'])
putExtLoader('txt', ['html', 'md'])
putExtLoader('video', ['mp4', 'mov', 'webm'])
putExtLoader('audio', ['mp3', 'wav', 'ogg'])

// 注册快捷方式路由
function _bindLoaderMethod (type: string, useContext?: boolean) {
  const _parseRes = (res: any): IResItem => {
    if (isString(res)) return { url: res, type, key: '' }
    if (!res.type) res.type = type
    return res
  }
  return function (this: Res, res: string | string[] | IResItem | IResItem[], option?: any) {
    const context = useContext ? this : Res.instance
    // 支持批量加载
    if (isArray(res)) {
      return Promise.all((<any[]>res).map(item => context.add(_parseRes(item), option)))
    } else {
      return context.add(_parseRes(res), option)
    }
  }
}

const _formatResStruct = (item: IResItem) => {
  const { url, type, key } = item
  if (!type) {
    const ext = extname(url).slice(1).toLowerCase()
    item.type = Res.extmaps[ext] || ext || 'text'
  }
  if (!key) {
    item.key = item.type + ':' + (url.length > 1024 * 10 ? md5(url) : url)
  }
  return item
}
