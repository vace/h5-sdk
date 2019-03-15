import '../assets/ui-modal.less'
import { noop } from '../functions/common'
import { classPrefix, createClsElement, createSdkIcon } from '../utils/shared'
import $ from '../venders/zepto'
import { parse } from '../functions/qs';
import { UiBase, UiBaseOption } from './UiBase';

type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info'

export type UiModalButton = {
  key?: string // 触发dialog的click事件的key
  label: string // 按钮名称
  href?: string // 用于拨号，邮箱
  onClick?: Function // 回调事件
  bold?: boolean // 是否加粗
  color?: TypeColor
  className?: string // 自定义className
}

export type UiModalInputType = 'hidden' | 'text' | 'tel' | 'password' | 'textarea' | 'number' | 'custom'

export type UiModalInput =  {
  name: string
  type?: UiModalInputType // 标签名称
  label?: string // 输入项名称
  tips?: string // 输入提示
  placeholder?: string
  value?: string
  disabled?: boolean
  innerHTML?: string // 自定义内容，type = custom有效
  [key: string]: any
}

type UiTheme = 'android' | 'ios'

export interface UiModalOption extends UiBaseOption {
  title?: string // 标题
  header?: string // 子标题
  content?: string // 内容
  footer?: string // 底部追加内容
  buttons?: UiModalButton[] // 操作按钮列表
  inputs?:  UiModalInput[]
  maskClose?: boolean
  transparent?: boolean
  target?: string | HTMLElement
  onClick?: (key?: string) => void // 按钮点击回调
  onClose?: Function
}

export type UiModalEvent = 'open' | 'opened' | 'close' | 'closed'

export class UiModal extends UiBase{
  // 全局配置
  public static option: UiModalOption = {
    isAddMask: true,
    theme: 'ios',
    target: 'body',
    onClick: noop
  }

  /**
   * 传入配置
   * @type {UiModalOption}
   * @memberof UiModal
   */
  // public option: UiModalOption

  // jquery element cache
  public $modal: ZeptoCollection
  public $form?: ZeptoCollection
  public $buttons?: ZeptoCollection
  public $spinning?: ZeptoCollection

  // 获取数据
  public get data (): {[key: string]: string} {
    const $form = this.$form
    return $form ? parse($form.serialize()) : {}
  }
  // prompt 获取数据
  public get value (): string {
    return this.data.value
  }

  constructor (_option: UiModalOption = {}) {
    super(Object.assign({}, UiModal.option, _option))
    // 挂载
    this.$modal = createClsElement('modal')
    
    // bind event
    const _this = this
    this.$root.append(this.$mask).on('click', '.' + classPrefix('modal-button'), function (this: any, evt) {
      const { buttons = [], onClick: globalOnClick = noop } = _this.option
      const { key = '', onClick = noop } = buttons[$(this).index()] || {}
      onClick.call(_this, _this, evt) // 响应事件
      globalOnClick.call(_this, key) // 回调全局事件
      _this.emit('click', key) // 触发事件
    })

    this.on('open', this._openHook.bind(this))
    this.on('closed', this._closedHook.bind(this))
  }
  // 显示操作loading
  public showSpinning (message: string) {
    if (this.$spinning) {
      this.$spinning.remove()
    }
    const $spinning = createClsElement('spinning', createSdkIcon('loading _sdk-rotate'))
    if (message) {
      $spinning.append(createClsElement('spinning-text', message))
    }
    this.$modal.append($spinning)
    this.$spinning = $spinning
    return this
  }
  // 隐藏交互loading
  public hideSpinning () {
    const $spinning: any = this.$spinning
    if ($spinning) {
      $spinning.fadeOut(() => $spinning.remove())
    }
    return this
  }

  // 准备打开
  private _openHook () {
    const { $root, $modal, id } = this
    // 渲染结构
    const { title, header, content, footer, buttons, inputs } = this.option
    const modalElements: ZeptoCollection[] = []
    if (title) {
      modalElements.push(createClsElement('modal-title', title))
    } else {
      $modal.addClass(classPrefix('modal-notitle'))
    }
    if (header) {
      modalElements.push(createClsElement('modal-header', header))      
    }
    if (content) {
      modalElements.push(createClsElement('modal-content', content))      
    }
    // 输入节点渲染
    if (inputs && inputs.length) {
      const tagTextarea = 'textarea'
      const $form = createClsElement('modal-form', '', 'form')
      let dataIndex = 0
      for (const { type, label, tips, value = '', innerHTML, ...attrs } of inputs) {
        const tagName = type !== tagTextarea ? 'input' : tagTextarea
        const $input = type === 'custom' ? $(innerHTML) : $(`<${tagName}>`).attr('type', type || 'text')
        const inputId = `${id}__i${++dataIndex}`
        $input.attr('id', inputId).attr(attrs).val(value || '')
        const labelHtml = label ? `<label for="${inputId}">${label || ''} ${tips ? `<span>${tips}</span>` : ''}</label>` : ''
        const $inputWrap = createClsElement('modal-iptwrap', labelHtml)
        const $inputCont = createClsElement('modal-input', $input)
        $inputWrap.append($inputCont)
        $form.append($inputWrap)
      }
      modalElements.push($form)
      this.$form = $form
    }
    if (footer) {
      modalElements.push(createClsElement('modal-footer', footer))      
    }
    const buttonsNumber = buttons && buttons.length
    if (buttons && buttonsNumber) {
      const $buttons = createClsElement('modal-buttons', buttons.map(({ href, label, bold, className, color }) => {
        return `<a href="${href || 'javascript:;'}" class="${classPrefix(['modal-button', bold && 'modal-bold', `color-${color || 'main'}`])} ${className || ''}">${label}</a>`
      }).join('')).addClass(classPrefix('modal-buttons-' + (buttonsNumber > 2 ? 'v' : 'h')))
      modalElements.push($buttons)
      this.$buttons = $buttons
    }
    // 节点渲染
    for (const $element of modalElements) {
      $modal.append($element) 
    }
    $root.append($modal)
  }

  private _closedHook() {
    this.$modal.html('')
  }
}
