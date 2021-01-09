import Emitter from './Emitter'
import { uid, wait, isDef, isArray, splice } from '../functions/common'
import $ from '../venders/zepto.js'

/** UI支持的颜色 */
export type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info'

/** UI支出的主题 */
export type UiTheme = 'android' | 'ios' | 'half'

/** 通用默认配置 */
export type UiBaseOption = {
  /** 指定根元素ID */
  id?: string
  /** 渲染主题 */
  theme?: UiTheme
  /** 是否添加遮罩层 */
  isAddMask?: boolean
  /** 是否包含表单 */
  isForm?: boolean
  /** 类名 */
  className?: string
  /** 延迟自动关闭时间 */
  duration?: boolean | number
  /** 挂载根元素 */
  target?: string | HTMLElement
  /** 关闭回调 */
  onClose?: Function
  [key: string]: any
}

/** UI支出的事件参数 */
export type UiBaseEvent = 'open' | 'opened' | 'close' | 'closed'


/** UI按钮配置 */
export type UiButtonOption = {
  /** 触发的click事件的key */
  key?: string
  /** 按钮名称 */
  label: string
  /** `button`转换为`a`用于拨号，邮箱 */
  href?: string
  /** 点击回调 */
  onClick?: Function // 回调事件
  /** 文字加粗 */
  bold?: boolean // 是否加粗
  /** 文字颜色 */
  color?: TypeColor
  /** 自定义类名 */
  className?: string // 自定义className
}

/** UI输入框种类 */
export type UiInputType = 'hidden' | 'text' | 'tel' | 'password' | 'textarea' | 'number' | 'custom'

/** UI输入框配置 */
export type UiInputOption = {
  /** input 的name */
  name: string
  /** 标签名称 */
  type?: UiInputType
  /** 输入标签名称 */
  label?: string
  /** 输入提示 */
  tips?: string
  /** 默认输入内容 */
  placeholder?: string
  /** 默认值 */
  value?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义内容，type = custom有效 */
  innerHTML?: string
  /** 验证器，验证未通过返回失败原因，false或string */
  validate?: (value: string) => any
  [key: string]: any
}

/**
 * UiBase基础构造类
 * @class UiBase
 * @extends {Emitter}
 */
export default class UiBase extends Emitter {
  public static nextZIndex: number = 1e4

  public static get zIndex () {
    return UiBase.nextZIndex++
  }

  /** 所有打开的dialog集合，用于批量关闭 */
  public static openInstances: UiBase[] = []

  /** 关闭所有已经打开的弹窗 */
  public static closeAll () {
    const instances = UiBase.openInstances
    for (const instance of instances) {
      instance.close()
    }
    // issu clear
    instances.length = 0
  }
  /** 默认配置 */
  public static option: any = {
    isAddMask: false,
    target: 'body',
    duration: 2500
  }

  /** 时间触发器 */
  public emitter: any = null
  
  /** 实例配置 */
  public option: UiBaseOption

  // jquery element cache
  /** 挂载元素 */
  public $target?: ZeptoCollection
  /** 根元素 */
  public $root: ZeptoCollection
  /** 遮罩 */
  public $mask!: ZeptoCollection
  /** 动画入场className */
  public inClassName: string = classPrefix('fade-in')
  /** 动画出场className */
  public outClassName: string = classPrefix('fade-out')
  /** 组件ID */
  public id: string
  /** 弹窗是否打开 */
  public isOpened: boolean = false
  // close
  private _closeTid?: number | null
  /** 构造UI */
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
      .css({ zIndex: UiBase.zIndex, position: 'fixed' })
    // 合并全局变量
    if (isAddMask) {
      const { transparent, maskClose } = this.option
      this.$mask = createClsElement('mask')
        .addClass(transparent ? classPrefix('mask-tp') : '')
        .on('click', () => maskClose && this.close())
      this.$root.append(this.$mask)
    }
  }

  private _releaseCloseTid() {
    const _closeTid = <number>this._closeTid
    if (!isDef(_closeTid)) {
      clearTimeout(_closeTid)
    }
    this._closeTid = null
  }

  /** 打开弹窗 */
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

    if (this.option.isForm) {
      $root.on('blur', 'input', this._onFormBlur)
      $root.on('focus', 'input', this._onFormFocus)
    }
    $root.addClass(inClassName)
    // 渲染结构
    this.emit('open')
  }
  // 打开成功
  private _onOpened() {
    const { $root, inClassName } = this
    $root.removeClass(inClassName)
    this.emit('opened')
    // push open instance
    UiBase.openInstances.push(this)
  }

  // 定时容器滚动（ios软键盘bug）
  private $_autoScrollTopId: any

  // 表单失去焦点，运行
  private _onFormBlur = (e: any) => {
    this.$_autoScrollTopId = setTimeout(() => {
      const del = document.documentElement
      del.scrollTop = del.scrollTop
    }, 150)
    const field = e.target && e.target.name
    // 运行验证器
    this.validateForm(field)
  }
  // 表格获得焦点，执行表单校检
  private _onFormFocus = (e: any) => {
    clearTimeout(this.$_autoScrollTopId)
    // 清空验证器
    const field = e.target && e.target.name
    this.validateClear(field)
  }

  // 表单验证
  public validateForm (field?: string) {
    return true
  }

  // 清空错误消息
  public validateClear (field?: string) {
    return true
  }

  /** 关闭弹窗 */
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
    if (this.option.isForm) {
      $root.off('blur', 'input', this._onFormBlur)
      $root.off('focus', 'input', this._onFormFocus)
    }
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
    // remove instance
    splice(UiBase.openInstances, this)
  }
  /** 延迟关闭 */
  public wait(duration: number): Promise<UiBase> {
    var promise: any = wait(duration, this)
    promise.close = () => promise.then(() => this.close())
    return promise
  }
}


export function classPrefix(className: string | any[]): string {
  if (isArray(className)) {
    return className.filter(cn => !!cn).map(cn => `_sdk-${cn}`).join(' ')
  }
  return `_sdk-${className}`
}

export function createClsElement(
  className: string,
  content?: string | ZeptoCollection,
  tagName: string = 'div'
): ZeptoCollection {
  return $(`<${tagName}>`).addClass(classPrefix(className)).append(content)
}

export function onceAnimationEnd($element: ZeptoCollection, callback: any): any {
  const { off } = $.fx
  // 不支持动画时直接返回执行结果
  if (off) {
    return callback()
  } else {
    // zepto.one bind once event
    // fixed andioid 4.4 存在bug，无法触发animationend
    return $element.one('webkitAnimationEnd animationend', callback)
  }
}

export function createSdkIcon(name: string): string {
  return `<i class="_sdkfont _sf-${name}"></i>`
}
