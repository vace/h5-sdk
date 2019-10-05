import { assign } from 'es6-object-assign'

import '../assets/ui-music.less'
import starLoadingSvg from '../assets/star-loading'
import Emitter from "./Emitter";
import { createClsElement, classPrefix } from "../utils/shared";
import { addListener } from '../functions/helper';
import { each, pick } from "../functions/underscore";
import { isNullOrUndefined } from "../functions/is";
import config from '../config';
import $ from '../venders/zepto';
import { isWechat, isMobile } from '../functions/environment';
import { ready } from '../plugins/jssdk';
import { document } from '../utils/global';

/** 配置项 */
export interface IUiMusicOption {
  /** 是否在后台播放 */
  background?: boolean
  /** 挂载元素 */
  target?: string
  /** 音乐路径 */
  src?: string
  /** 类名 */
  className?: string
  /** 主题 */
  theme?: string
  /** 位置 */
  position?: 'tl' | 'tr' | 'bl' | 'br'
  /** 默认样式 */
  style?: any
  /** 是否自动播放 */
  autoplay?: boolean
  /** 是否循环播放 */
  loop?: boolean
  /** 是否静音 */
  muted?: boolean
  /** 默认音量 */
  volume?: number
  /** 预加载付出 */
  preload?: 'none' | 'metadata' | 'auto'
  /** X方向偏移量 */
  offsetX?: number | string
  /** Y方向偏移量 */
  offsetY?: number | string
  /** 图标尺寸 */
  size?: number | string
  /** 点击回调 */
  onClick?: Function
}

/** 主题注册 */
export interface IUiMusicTheme {
  /** 播放中主题 */
  playing: string | Function
  /** 暂停状态主题 */
  paused: string | Function
  /** 加载中主题 */
  loading?: string | Function
}

/** 雪碧音支持 */
interface IUiMusicTimeline {
  /** 开始播放时间点 */
  begin: number
  /** 结束播放时间点 */
  end: number
  /** 是否循环播放 */
  loop?: boolean
}

/** 事件处理 */
enum UiMusicEvent {
  pause, playing, canplay, ended, loading, timeupdate
}

const createCdnImage = (type: string, idx: number) => `<img src="${config.cdn}/_res/music/${type}_${idx}.svg" alt="${type}">`

/**
 * 音乐播放器
 */
export default class UiMusic extends Emitter {
  public static _instance: UiMusic
  /** 获取默认实例 */
  public static get instance () {
    return this.createInstance({})
  }
  /** 是否有实例 */
  public static get hasInstance(): boolean {
    return !!this._instance
  }
  /** 获取单例 */
  public static createInstance (option: IUiMusicOption): UiMusic {
    if (!this._instance) {
      this._instance = new UiMusic(option)
    }
    return this._instance
  }
  /** 全局配置 */
  public static option: IUiMusicOption ={
    target: 'body',
    src: 'music.mp3',
    theme: 'default',
    position: 'tr',
    autoplay: true,
    preload: 'auto',
    loop: true,
    muted: false,
    volume: 1,
    offsetX: 16,
    offsetY: 16,
    size: 36,
    background: false
  }
  /** 主题列表 */
  public static themes = new Map
  /** 注册主题 */
  public static registerTheme (themeName, adapter: IUiMusicTheme | number[]): Map<string, IUiMusicTheme> {
    let _adapter: IUiMusicTheme
    if (Array.isArray(adapter)) {
      const [playingIndex, pausedIndex] = adapter
      _adapter = {
        playing: createCdnImage('playing', playingIndex),
        paused: createCdnImage('paused', pausedIndex)
      }
    } else {
      _adapter = adapter
    }
    return this.themes.set(themeName, _adapter)
  }
  /** 雪碧音支持 */
  public timelines: Record<string, IUiMusicTimeline> = Object.create(null)
  /** 实例配置 */
  public option: IUiMusicOption
  /** 是否挂载 */
  public isMounted: boolean = false
  /** 用户暂停应用 */
  public isUserPaused: boolean = false
  
  /** 是否正在加载 */
  private _isLoading: boolean = false
  /** 是否正在播放 */
  private _isPlaying: boolean = false
  /** 是否暂停播放 */
  private _isPaused: boolean = false

  // 根节点
  public $root: ZeptoCollection = createClsElement('music')
  public $view: ZeptoCollection = createClsElement('music-view')
  public $loading: ZeptoCollection
  public $playing: ZeptoCollection
  public $paused: ZeptoCollection
  // audio 元素
  public audio:HTMLAudioElement = document.createElement('audio')
  constructor (_option: IUiMusicOption) {
    super()
    this.option = assign({}, UiMusic.option, _option)
    const { $root, $view, audio, option } = this
    const { className, position = '', style = {}, autoplay, size, offsetX, offsetY } = option
    const $loading = this.$loading = createClsElement('music-loading')
    const $playing = this.$playing = createClsElement('music-playing')
    const $paused = this.$paused = createClsElement('music-paused')
    // 图标区域尺寸
    const styleExtends = {width: size, height: size}
    // 图标区域样式附加
    const positionMap = { l: 'left', r: 'right', b: 'bottom', t: 'top' }
    for (const value of position.split('')) {
      const directionAttr = positionMap[value]
      if (directionAttr) {
        styleExtends[directionAttr] = (value === 'l' || value === 'r') ? offsetX : offsetY
      }
    }
    position.split('').forEach(value => {
      if (positionMap[value]) {
        styleExtends[positionMap[value]] = (value === 'l' || value === 'r') ? offsetX : offsetY
      }
    })
    $view.append($loading).append($playing).append($paused)
    $root.css(assign(styleExtends, style))
      .addClass(classPrefix(`pos-${position}`))
      .addClass(className || '')
      .append($view)

    // 事件代理
    for (const eventId of [UiMusicEvent.pause, UiMusicEvent.playing, UiMusicEvent.canplay, UiMusicEvent.ended]) {
      addListener(audio, UiMusicEvent[eventId], (event: any) => this._handleEvent(eventId, event))
    }
    this.load()
    // 自动播放处理
    if (autoplay) {
      this.audio.autoplay = true
      // 移动端不允许直接播放audio
      if (isWechat) {
        ready(this.play)
      } else {
        $(document).one('click', this.play)
      }
    }
    // root click toggle
    this.$root.on('click', () => {
      const { isPaused, isPlaying, option: { onClick } } = this
      if (isPaused) this.play()
      else if (isPlaying) {
        // 暂停由用户触发，部分场景下希望暂停背景音乐
        this.isUserPaused = true
        this.pause()
      }
      if (typeof onClick === 'function') {
        onClick.call(this, this)
      }
    })
    // 禁止背景播放处理
    if (!option.background) {
      addListener(document, 'visibilitychange', () => {
        // 页面隐藏时暂停，恢复时检测是否需要重新播放
        document.hidden ? this.pause() : this.replay()
      })
    }
  }
  /** 设置播放进度 */
  public set currentTime (val: number) {
    this.audio.currentTime = val
  }
  /** 读取播放进度 */
  public get currentTime (): number {
    return this.audio.currentTime
  }
  /** 获取主题 */
  public get theme (): IUiMusicTheme {
    return UiMusic.themes.get(this.option.theme)
  }
  // 是否加载中
  public set isLoading (val: boolean) {
    this._isLoading = val
    this.$root.toggleClass(classPrefix('music__loading'), val)
  }
  /** 获取是否加载中状态 */
  public get isLoading (): boolean {
    return this._isLoading
  }
  /** 设置暂停状态 */
  public set isPaused(val: boolean) {
    this._isPaused = val
    this.$root.toggleClass(classPrefix('music__paused'), val)
  }
  /** 读取暂停状态 */
  public get isPaused(): boolean {
    return this._isPaused
  }
  /** 设置播放状态 */
  public set isPlaying(val: boolean) {
    this._isPlaying = val
    this.$root.toggleClass(classPrefix('music__playing'), val)
  }
  /** 读取播放状态 */
  public get isPlaying(): boolean {
    return this._isPlaying
  }

  /**
   * 加载音乐路径
   * @param {string} [src]
   * @returns
   */
  public load (src?: string) {
    const { option, audio } = this
    const _url = src || option.src
    // 开始加载
    this._handleEvent(UiMusicEvent.loading)
    if (_url) {
      audio.src = _url
    } else {
      throw new TypeError('UiMusic `src` required')
    }
    // 设置audio 属性
    const setting = pick(option, ['autoplay', 'loop', 'muted', 'volume', 'preload'])
    each(setting, (value: any, key: string) => !isNullOrUndefined(value) && (audio[key] = value))
    return this
  }
  /** 播放 */
  public play = () => {
    this.isUserPaused = false
    this.audio.play()
    return this
  }
  /** 暂停 */
  public pause = () => {
    this.audio.pause()
  }
  /** 重新播放，如果用户手动暂停，则不会重播 */
  public replay = () => {
    if (!this.isUserPaused) {
      this.play()
    }
  }

  /** 销毁 */
  public destory () {
    this.pause()
    this.$root.remove()
    this.isMounted = false
    this.$loading.html('')
    this.$playing.html('')
    this.$paused.html('')
    this.emit('destory')
  }
  // 事件处理
  private _handleEvent (eventId: number, event?: any) {
    const eventName = UiMusicEvent[eventId]
    const {
      $root,
      $loading,
      $playing,
      $paused,
      isMounted,
      option: { target, theme: optTheme, autoplay },
      theme,
      audio
    } = this
    if (!theme) {
      throw new TypeError(`UiMusic theme not exists:` + optTheme);
    }
    // 挂载处理
    if (!isMounted) {
      const append = ($el: ZeptoCollection, content: any) => $el.append(typeof content === 'function' ? content.call(this, this) : content)
      this.isMounted = true
      const { loading, playing, paused } = theme
      append($loading, loading || starLoadingSvg)
      append($playing, playing)
      append($paused, paused)
      // dom ready
      $(target).append($root)
    }
    if (eventId === UiMusicEvent.loading) {
      this.isPlaying = this.isPaused = false
      this.isLoading = true  
    } else if (eventId === UiMusicEvent.playing) {
      this.isLoading = this.isPaused = false
      this.isPlaying = true
    } else if (eventId === UiMusicEvent.pause || eventId === UiMusicEvent.canplay) {
      this.isLoading = this.isPlaying = false
      this.isPaused = true
    } else if (eventId === UiMusicEvent.timeupdate) {

    }
    // 准备就绪
    // if (eventId === UiMusicEvent.canplay) {
    //   // fixed 自动播放未播放，浏览器限制
    //   if (autoplay && audio.paused) {
    //     if (isWechat) fire(this.play)
    //     else {
    //       if (!isMobile) setTimeout(this.play, 0)
    //       $(document).one('click', this.play)
    //     }
    //   }
    // }
    this.emit(eventName, event)
  }


  /**
   * timeline 支持
   */
  /** 添加雪碧音 */
  public addTimeline (name: string, timeline: IUiMusicTimeline) {
    this.timelines[name] = timeline
  }
  private _unbindTimeupdate!: Function
  /** 播放指定片段雪碧音 */
  public gotoAndPlay (name: string, callback?: Function) {
    const timeline = this.timelines[name]
    if (!timeline) {
      throw new TypeError(`timeline ${name} not existed`);
    }
    if (typeof this._unbindTimeupdate === 'function') {
      this._unbindTimeupdate()
    }
    const audio = this.audio
    const { begin, end, loop } = timeline
    audio.currentTime = begin
    this._unbindTimeupdate = addListener(this.audio, 'timeupdate', () => {
      if (audio.currentTime < end) return
      if (loop) {
        audio.currentTime = begin
      } else {
        this.pause()
        this._unbindTimeupdate()
        this.emit('timelineend', name)
        if (typeof callback === 'function') {
          callback(timeline)
        }
      }
    })
    this.play()
  }
}

// system theme
;[
  [19, 1], // default
  [1, 18], [2, 21], [3, 7], [4, 13], [5, 18], [6, 8],
  [7, 21], [8, 2], [9, 15], [10, 8], [11, 10], [12, 13],
  [13, 7], [14, 7], [15, 7], [16, 6], [17, 18], [18, 20],
  [19, 6], [20, 7], [21, 13], [22, 13], [23, 6], [24, 6],
  [25, 7], [26, 18], [27, 12], [28, 15], [29, 2], [30, 12],
  [31, 3], [32, 5], [33, 7], [34, 14], [35, 11], [36, 15],
  [37, 16], [38, 19], [39, 16], [40, 9], [41, 5], [42, 13],
  [43, 7], [44, 16], [45, 16], [46, 16], [47, 1], [48, 7],
  [49, 18]
].forEach((value, idx) => UiMusic.registerTheme(idx ? `theme${idx}` : 'default', value))
