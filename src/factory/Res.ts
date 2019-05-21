import { each } from '../functions/underscore';
import { document } from '../utils/global';
import { isHttp, isBase64 } from '../functions/is';
import Emitter from './Emitter';

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
  // 全局加载进度
  public static pending: number = 0
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
  /** 清空计数器，一般用于二次加载的需求 */
  public clear () {
    this.total = this.current = this.pending = this.loaded = this.failed = 0
    this.$notify('clear')
  }
  /** 分发加载事件 */
  public $notify (event: ResEvent) {
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
    ResProgress.pending += 1
    this.pending += 1
    this.$notify('pending')
  }
  /** 加载成功 */
  public $loaded () {
    this.pending -= 1
    ResProgress.pending -= 1
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
    ResProgress.pending -= 1
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
  /** 资源ID */
  public static id: number = 0
  /** 进度实例 */
  public static Progress: typeof ResProgress = ResProgress
  /** 默认配置 */
  public static config: ResConfig = {
    autoStart: false,
    concurrency: 10,
    root: '',
    defaultType: TYPE.UNKNOWN
  }
  /** 加载任务缓存 */
  public static cache: Record<string, ResouceStruct> = Object.create(null)
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
    this[type] = (res: string | PushResStruct, option?: any) => {
      if (typeof res === 'string') {
        res = { url: res }
      }
      res.type = type
      return Res.instance.add(res, option)
    }
    // 原型链注册
    (Res.prototype as any)[type] = function (this: Res, res: string | PushResStruct, option?: any) {
      if (typeof res === 'string') {
        res = { url: res }
      }
      res.type = type
      return this.add(res, option)
    }
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
  public static get (key: string | number): ResouceStruct {
    return this.cache[key]
  }

  /** 实例配置 */
  public config: ResConfig

  /** 是否开始加载 */
  public isStart: boolean = false
  /** 是否正在工作，加载队列完成后=false */
  public isWorking: boolean = false
  /** 操作进度 */
  public progress: ResProgress = new ResProgress

  /** 加载队列 */
  public queue: ResouceStruct[] = []
  /** 当前实例缓存 */
  public cache: Record<string, ResouceStruct> = Object.create(null)

  /** 队列是否完全加载 */
  public get isComplete () {
    return this.progress.isComplete
  }

  /** 初始化 */
  public constructor(option?: ResConfig) {
    super()
    this.config = Object.assign({}, Res.config, option)
    // 绑定进度实例
    this.progress.$bus = this
    if (this.config.autoStart) {
      this.start()
    }
  }
  /** 开始加载 */
  public start() {
    if (!this.isStart) {
      this.isStart = true
      this.progress.$notify('start')
      // 队列中没有任务，直接通知完成
      if (this.isComplete) {
        this.progress.$notify('complete')
      }
    }
    // 未工作，任务未完成
    if (!this.isComplete) {
      // do task
      this.$working()
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
  public get (key: string | number): ResouceStruct {
    return Res.get(key)
  }
  /** 追加资源 */
  public add(res: PushResStruct, option?: any) {
    const { config: { root, defaultType } } = this
    let { key, url, type = defaultType } = res
    if (root && !(isHttp(url) || isBase64(url))) {
      url = root + url
    }
    // 完整的url
    key = key || url
    if (typeof key !== 'string') {
      throw new TypeError(`Res Key Must Be String，Current Is： ${key}`);
    }
    /** 资源缓存KEY */
    let item: ResouceStruct = Res.cache[key]
    // 命中缓存
    if (item) {
      // 缓存不一致
      if (item.type !== type || item.url !== url) {
        throw new Error('Res:' + key + ' Already Exist，But `type` Or `url` Inconformity')
      }
    } else {
      let _resolve: Function, _reject: any
      const promise = new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
      })
      // 任务调度处理
      const task = promise as ResourceTask
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
      Res.cache[key] = item
      // 根据任务缓存
      Res.cache[task.id] = item
    }
    // 加入到当前队列中
    const { isStart, cache } = this
    if (!cache[key]) {
      cache[key] = item
      this.queue.push(item)
      this.progress.$added()
    }
    if (isStart) {
      this.start()
    }
    return item.task
  }
  /** 保持工作状态 */
  private $working () {
    this.isWorking = true
    const { queue, config, progress } = this
    // 任务被清空 || 任务未启动，终止加载任务
    if (!queue.length || !this.isStart) {
      this.isWorking = false
      return
    }
    const concurrency = config.concurrency
    // 控制进程最大量
    if (concurrency && ResProgress.pending >= concurrency) {
      return
    }
    const item = <ResouceStruct> queue.shift()
    if (item.status === STATUS.ADDED) {
      item.task.exec()
    }
    progress.$pending()
    // 持续调用working
    item.task.then(() => {
      progress.$loaded()
      this.$working()
    }, () => {
      progress.$failed()
      this.$working()
    })
    this.$working()
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
    let eventResolve: 'onload' | 'oncanplaythrough' | 'oncanplay' = 'onload'
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
    else if (type === TYPE.AUDIO) {
      eventResolve = 'oncanplaythrough'
      _option = { src: url }
    }
    else if (type === TYPE.VIDEO) {
      eventResolve = 'oncanplay'
      _option = { src: url }
    }
    const element = document.createElement(tagName)
    // 绑定事件
    element[eventResolve] = () => resolve(element)
    element.onerror = reject
    each(Object.assign(_option, option), (val: string, key: string) => element.setAttribute(key, val))
    if (isInsertDocument) {
      const inserted = document.head || document.documentElement
      inserted.insertAdjacentElement('beforeend', element)
    }
  }))
})

/** 配置文件 */
type ResConfig = {
  /** 并发量 */
  concurrency?: number
  /** 根目录 */
  root?: string
  /** 默认类型 */
  defaultType?: string,
  /** 是否自动开始 */
  autoStart?: boolean
}

/** 资源预加载处理 */
type PushResStruct = {
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
type ResouceStruct = {
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
  task: ResourceTask
  /** 任务参数 */
  option: any
  /** 错误信息，出错时包含 */
  error?: any
}

interface ResourceTask extends Promise<ResouceStruct> {
  id: number,
  exec: (a?: ResouceStruct) => void
}

/** 事件通知 */
export type ResEvent = 'push' | 'pending' | 'success' | 'complete' | 'fail' | 'clear' | 'progress' | 'start' | 'paused'
