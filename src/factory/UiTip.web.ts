import type { ZeptoCollection } from '../types/zepto'

import '../assets/ui-tip.less'
import { noop, assign } from "../functions/common";
import UiBase, { UiBaseOption, classPrefix, createClsElement, createSdkIcon } from "./UiBase.web";

/** 设置选项 */
export type UiTipOption = UiBaseOption & {
  /** 消息内容 */
  message?: string
  /** 点击可关闭 */
  clickClosed?: boolean
  /** 点击回调 */
  onClick?: (this: UiTip, instance: UiTip) => void
  /** 类型 */
  // type?: string
}

/**
 * tip提示类
 */
export default class UiTip extends UiBase {
  /** 全局配置 */
  public static option: UiTipOption = {
    target: 'body',
    onClose: noop,
    isAddMask: false,
    duration: 2500
  }

  // jquery element cache
  /** body 内容 */
  public $body: ZeptoCollection

  public inClassName: string = classPrefix('in-down')
  public outClassName: string = classPrefix('out-up')

  constructor(_option: UiTipOption) {
    super(assign({}, UiTip.option, _option))
    this.$body = createClsElement('tip-body')
    this.$root.addClass(classPrefix('tip')).on('click', () => {
      const { onClick, clickClosed } = this.option
      if (typeof onClick === 'function') {
        onClick.call(this, this)
      }
      if (clickClosed) {
        this.close()
      }
    }).append(this.$body)
    this.on('open', this._openHook.bind(this))
    this.on('closed', this._closedHook.bind(this))
  }
  /** 更新消息内容 */
  public setMessage(message: string) {
    (<any>this.$body.html(message)).fadeIn()
    return this
  }
  private _openHook() {
    const { $body } = this
    const { message } = this.option
    $body.html(message || '')
  }
  private _closedHook() {
    this.$root.html('')
  }
}
