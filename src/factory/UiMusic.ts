import '../assets/ui-music.less'
import starLoadingSvg from '../assets/star-loading'

import Emitter from "./Emitter";
import { createClsElement, classPrefix } from "../utils/shared";
import { addListener } from '../functions/helper';
import { each, pick } from "../functions/underscore";
import { isNullOrUndefined } from "../functions/is";
import config from '../config';
import $ from '../venders/zepto';
import { isWechat } from '../functions/environment';
import { fire } from '../plugins/jssdk';

export interface UiMusicOption {
  target?: string
  src?: string
  className?: string
  theme?: string
  position?: 'tl' | 'tr' | 'bl' | 'br'
  style?: any
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  volume?: number
  preload?: 'none' | 'metadata' | 'auto'
  offsetX?: number | string
  offsetY?: number | string
  size?: number | string
  onClick?: Function
}

interface UiMusicTheme {
  playing: string | Function
  paused: string | Function
  loading?: string | Function
}

enum PEvent {
  pause, playing, canplay, ended, loading
}

const createCdnImage = (type: string, idx: number) => `<img src="${config.cdn}/_res/music/${type}_${idx}.svg" alt="${type}">`

export class UiMusic extends Emitter {
  public static _instance: UiMusic

  public static getInstance (option: UiMusicOption): UiMusic {
    if (!this._instance) {
      this._instance = new UiMusic(option)
    }
    return this._instance
  }

  public static option: UiMusicOption ={
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
    size: 36
  }
  public static themes = new Map

  public static registerTheme (themeName, adapter: UiMusicTheme | number[]): Map<string, UiMusicTheme> {
    let _adapter: UiMusicTheme
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

  // 配置项
  public option: UiMusicOption
  // 播放节点是否挂载
  public isMounted: boolean = false
  private _isLoading: boolean = false
  private _isPlaying: boolean = false
  private _isPaused: boolean = false

  // 是否能自动播放
  public isSupportAutoPlay: boolean = false
  // 根节点
  public $root: ZeptoCollection = createClsElement('music')
  public $view: ZeptoCollection = createClsElement('music-view')
  public $loading: ZeptoCollection
  public $playing: ZeptoCollection
  public $paused: ZeptoCollection
  // audio 元素
  public audio:HTMLAudioElement = document.createElement('audio')
  constructor (_option: UiMusicOption) {
    super()
    this.option = Object.assign({}, UiMusic.option, _option)
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
    $root.css(Object.assign(styleExtends, style))
      .addClass(classPrefix(`pos-${position}`))
      .addClass(className || '')
      .append($view)

    // 事件代理
    for (const eventId of [PEvent.pause, PEvent.playing, PEvent.canplay, PEvent.ended]) {
      addListener(audio, PEvent[eventId], (event: any) => this._handleEvent(eventId, event))
    }

    // 自动播放处理
    if (autoplay) {
      this.load()
    }
    // root click toggle
    this.$root.on('click', () => {
      const { isPaused, isPlaying, option: { onClick } } = this
      if (isPaused) this.play()
      else if (isPlaying) this.pause()
      if (typeof onClick === 'function') {
        onClick.call(this, this)
      }
    })
  }
  // 设置 & 读取播放时间
  public set currentTime (val: number) {
    this.audio.currentTime = val
  }
  public get currentTime (): number {
    return this.audio.currentTime
  }
  public get theme (): UiMusicTheme {
    return UiMusic.themes.get(this.option.theme)
  }
  // 是否加载中
  public set isLoading (val: boolean) {
    this._isLoading = val
    this.$root.toggleClass(classPrefix('music__loading'), val)
  }
  public get isLoading (): boolean {
    return this._isLoading
  }
  // 是否加载中
  public set isPaused(val: boolean) {
    this._isPaused = val
    this.$root.toggleClass(classPrefix('music__paused'), val)
  }
  public get isPaused(): boolean {
    return this._isPaused
  }
  // 是否加载中
  public set isPlaying(val: boolean) {
    this._isPlaying = val
    this.$root.toggleClass(classPrefix('music__playing'), val)
  }
  public get isPlaying(): boolean {
    return this._isPlaying
  }

  // 加载音频
  public load (src?: string) {
    const { option, audio } = this
    const _url = src || option.src
    // 开始加载
    this._handleEvent(PEvent.loading)
    if (_url) {
      audio.src = _url
    } else {
      throw new TypeError('UiMusic `src` required')
    }
    // 设置audio 属性
    const setting = pick(option, ['autoplay', 'loop', 'muted', 'volume', 'preload'])
    each(setting, (value: any, key: string) => !isNullOrUndefined(value) && (audio[key] = value))
  }
  public play () {
    this.audio.play()
    return this
  }
  public pause () {
    this.audio.pause()
  }
  // 销毁
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
    const eventName = PEvent[eventId]
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
      throw new TypeError(`adapter theme: '${optTheme}' not exists`);
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
    if (eventId === PEvent.loading) {
      this.isPlaying = this.isPaused = false
      this.isLoading = true  
    } else if (eventId === PEvent.playing) {
      this.isLoading = this.isPaused = false
      this.isPlaying = true
    } else if (eventId === PEvent.pause || eventId === PEvent.canplay) {
      this.isLoading = this.isPlaying = false
      this.isPaused = true
    }
    // 准备就绪
    if (eventId === PEvent.canplay) {
      // fixed 自动播放未播放，浏览器限制
      if (autoplay && audio.paused) {
        const trigger = this.play.bind(this)
        if (isWechat) fire(trigger)
        else $(document).one('click', trigger)
      }
    }
    this.emit(eventName, event)
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
