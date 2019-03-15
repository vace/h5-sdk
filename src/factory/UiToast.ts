import '../assets/ui-toast.less'

import { noop } from "../functions/common";
import { classPrefix, createClsElement, createSdkIcon } from "../utils/shared";
import { UiBase, UiBaseOption } from "./UiBase";

export type UiToastOption = UiBaseOption & {
  icon?: string // 图标
  message?: string
  className?: string
  clickClosed?: boolean // 点击可关闭
  onClick?: Function
}

export class UiToast extends UiBase{
  // 全局配置
  public static option: UiToastOption = {
    target: 'body',
    onClose: noop,
    theme: 'ios',
    isAddMask: false
  }

  // jquery element cache
  public $header?: ZeptoCollection
  public $body?: ZeptoCollection
  public $message: ZeptoCollection

  public inClassName: string = classPrefix('fade-in')
  public outClassName: string = classPrefix('fade-out')

  /**
   * 组件ID
   * @type {string}
   * @memberof UiModal
   */

  constructor (_option: UiToastOption) {
    super(Object.assign({}, UiToast.option, _option))
    this.$message = createClsElement('toast-message', '')
    this.$root.addClass(classPrefix('toast')).on('click', () => {
      const { onClick, clickClosed } = this.option
      if (typeof onClick === 'function') {
        onClick.call(this, this)
      }
      if (clickClosed) {
        this.close()
      }
    })
    this.on('open', this._openHook.bind(this))
    this.on('closed', this._closedHook.bind(this))
  }
  // 更新消息内容
  public setMessage(message: string) {
    (<any>this.$message.html(message)).fadeIn()
    return this
  }
  // 更新图标内容
  public setIcon(icon: string) {
    this.$root.find('._sdkfont').removeClass(this.option.icon).addClass(icon)
    return this
  }

  private _openHook () {
    const { $root, $message } = this
    const { icon, message } = this.option
    if (icon) {
      $root.append(createClsElement('toast-icon', createSdkIcon(icon)))
    }
    $root.append($message.html(message || ''))
  }
  private _closedHook () {
    this.$root.html('')
  }
}
