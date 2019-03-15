import Emitter from './Emitter'
import { uid, wait } from '../functions/common'
import { nextZIndex, onceAnimationEnd, classPrefix, createClsElement } from '../utils/shared'
import $ from '../venders/zepto'
import { isNullOrUndefined } from '../functions/is'

export type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info'

export type UiTheme = 'android' | 'ios'

export type UiBaseOption = {
  id?: string
  theme?: UiTheme
  isAddMask?: boolean
  className?: string
  duration?: boolean | number
  target?: string | HTMLElement
  onClose?: Function
  [key: string]: any
}

export type UiBaseEvent = 'open' | 'opened' | 'close' | 'closed'

export class UiBase extends Emitter {
  // 默认参数
  public static option: any = {
    isAddMask: false,
    target: 'body',
    duration: 2500
  }

  public emitter: any = null
  /**
   * 传入配置
   * @type {UiBaseOption}
   * @memberof UiBase
   */
  public option: UiBaseOption

  // jquery element cache
  public $target?: ZeptoCollection
  public $root: ZeptoCollection
  public $mask: ZeptoCollection

  public inClassName: string = classPrefix('fade-in')
  public outClassName: string = classPrefix('fade-out')

  /**
   * 组件ID
   * @type {string}
   * @memberof UiBase
   */
  public id: string
  public isOpened: boolean = false
  // close
  private _closeTid?: number | null

  constructor(option: UiBaseOption = {}) {
    super()
    // 合并全局变量
    const { id, className, theme, isAddMask } = option
    const elementId = id || classPrefix(uid())
    this.id = elementId
    this.option = option
    this.$root = createClsElement(`theme-${theme || 'default'}`)
      .attr('id', elementId)
      .addClass(className || '')
      .css({ zIndex: nextZIndex(), position: 'fixed' })
    // 合并全局变量
    const { transparent, maskClose } = this.option
    this.$mask = createClsElement('mask')
      .addClass(transparent ? classPrefix('mask-tp') : '')
      .on('click', () => maskClose && this.close())
    if (isAddMask) {
      this.$root.append(this.$mask)
    }
  }

  private _releaseCloseTid() {
    const _closeTid = <number>this._closeTid
    if (!isNullOrUndefined(_closeTid)) {
      clearTimeout(_closeTid)
    }
    this._closeTid = null
  }

  /**
   * 打开弹层
   * @memberof UiBase
   */
  public open() {
    const { isOpened, option: { target, duration } } = this
    this.$target = $(target)
    if (!isOpened) {
      this._onOpen()
      // auto close
      this._releaseCloseTid()
      if (duration) {
        const closeTime = duration === true ? UiBase.option.duration : duration
        this._closeTid = <any>setTimeout(this.close.bind(this), closeTime)
      }
    }
    return this
  }

  // 准备打开
  private _onOpen() {
    const { $target, $root, inClassName } = this
    this.isOpened = true
    ;($target as ZeptoCollection).append($root)
    // 监听事件
    onceAnimationEnd($root, this._onOpened.bind(this))
    $root.addClass(inClassName)
    // 渲染结构
    this.emit('open')
  }
  // 打开成功
  private _onOpened() {
    const { $root, inClassName } = this
    $root.removeClass(inClassName)
    this.emit('opened')
  }
  /**
   * 关闭弹层
   * @memberof UiBase
   */
  public close() {
    const { isOpened } = this
    if (isOpened) {
      this._onClose()
      this._releaseCloseTid()
    }
  }
  private _onClose() {
    const { $root, outClassName, option: { onClose } } = this
    this.isOpened = false
    onceAnimationEnd($root, this._onClosed.bind(this))
    $root.addClass(outClassName)
    this.emit('close')
    // 关闭回调函数
    if (typeof onClose === 'function') {
      onClose.call(this, this)
    }
  }
  private _onClosed() {
    const { $root, outClassName } = this
    $root.removeClass(outClassName).remove()
    this.emit('closed')
  }

  public wait(duration: number): Promise<UiBase> {
    var promise: any = wait(duration, this)
    promise.close = () => promise.then(() => this.close())
    return promise
  }
}
