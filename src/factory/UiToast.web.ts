import '../assets/ui-toast.less'
import { noop, assign } from "../functions/common";
import UiBase, { UiBaseOption, classPrefix, createClsElement, createSdkIcon } from "./UiBase.web";

/** 设置选项 */
export type UiToastOption = UiBaseOption & {
  /** 图标 */
  icon?: string
  /** 消息内容 */
  message?: string
  /** 点击可关闭 */
  clickClosed?: boolean
  /** 点击回调 */
  onClick?: (this: UiToast, instance: UiToast) => void
}

/**
 * Toast提示类
 */
export default class UiToast extends UiBase{
  /** 全局配置 */
  public static option: UiToastOption = {
    target: 'body',
    onClose: noop,
    theme: 'ios',
    isAddMask: false
  }

  // jquery element cache
  /** body 内容 */
  public $body: ZeptoCollection
  /** 图标内容 */
  public $icon!: ZeptoCollection
  /** 消息内容 */
  public $message: ZeptoCollection

  // public inClassName: string = classPrefix('fade-in')
  // public outClassName: string = classPrefix('fade-out')

  constructor (_option: UiToastOption) {
    super(assign({}, UiToast.option, _option))
    this.$body = createClsElement('toast-body')
    this.$message = createClsElement('toast-message', '')
    this.$root.addClass(classPrefix('toast')).on('click', () => {
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
    (<any>this.$message.html(message)).fadeIn()
    return this
  }
  /** 更新图标内容 */
  public setIcon(icon: string) {
    const iconPrefix = '_sf-'
    this.$root.find('._sdkfont').removeClass(iconPrefix + this.option.icon).addClass(iconPrefix + icon)
    return this
  }

  private _openHook () {
    const { $body, $message } = this
    const { icon, message } = this.option
    if (icon) {
      if (!this.$icon) {
        this.$icon = createClsElement('toast-icon', createSdkIcon(icon))
        $body.append(this.$icon)
      } else {
        this.setIcon(icon)
      }
    }
    $body.append($message.html(message || ''))
  }
  private _closedHook () {
    this.$root.html('')
  }
}
