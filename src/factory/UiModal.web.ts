import '../assets/ui-modal.less'
import { noop, parse, isPromise, assign } from '../functions/common'
import $ from '../venders/zepto.js'
import UiBase, { UiBaseOption, UiButtonOption, UiInputOption, classPrefix, createClsElement, createSdkIcon } from './UiBase.web';

/** UIModal配置 */
export interface UiModalOption extends UiBaseOption {
  /** 标题 */
  title?: string
  /** 子标题 */
  header?: string
  /** 内容 */
  content?: string
  /** 底部追加内容 */
  footer?: string
  /** 操作按钮列表 */
  buttons?: UiButtonOption[]
  /** 输入项列表 */
  inputs?:  UiInputOption[]
  /** 是否展示关闭按钮，只有title存在时渲染 */
  showClose?: boolean,
  /** 点击mask是否可关闭 */
  maskClose?: boolean
  /** 背景透明 */
  transparent?: boolean
  /** 挂载元素 */
  target?: string | HTMLElement
  /** 按钮点击回调 */
  onClick?: (key?: string) => void // 按钮点击回调
  /** 弹层关闭回调 */
  onClose?: Function
  // 表单验证器
  validate?: (key: string, value: string, data: object) => any
}

export default class UiModal extends UiBase{
  /** 全局配置 */
  public static option: UiModalOption = {
    isAddMask: true,
    theme: 'ios',
    target: 'body',
    onClick: noop
  }

  /** 弹层实例 */
  public $modal: ZeptoCollection
  /** 表单实例 */
  public $form?: ZeptoCollection
  /** 按钮列表实例 */
  public $buttons?: ZeptoCollection
  /** 加载中实例 */
  public $spinning?: ZeptoCollection

  /** 获取form的数据 */
  public get data (): {[key: string]: string} {
    const $form = this.$form
    return $form ? parse($form.serialize()) : {}
  }

  /** prompt 弹窗的数据 */
  public get value (): string {
    return this.data.value
  }

  constructor (_option: UiModalOption = {}) {
    // 是否设置表单类型，可手动设置
    if (_option.inputs && _option.inputs.length) {
      _option.isForm = true
    }
    // 半屏操作时默认可点击关闭
    if (_option.theme === 'half' && _option.maskClose == null) {
      _option.maskClose = true
    }
    super(assign({}, UiModal.option, _option))
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

  /** 执行一个异步任务，执行成功则关闭 */
  public withClose (next:Function | Promise<any>, message?: string) {
    const madal = this
    let _next = next
    if (typeof next === 'function') {
      _next = next(madal)
    }
    if (isPromise(_next)) {
      // show loading
      madal.showSpinning(message)
      return _next.then(value => {
        madal.hideSpinning()
        madal.close()
        return value
      }).catch(err => {
        madal.hideSpinning()
        return Promise.reject(err)
      })
    }
    madal.close()
    return Promise.resolve(_next)
  }

  /** 显示操作loading */
  public showSpinning (message?: string) {
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
  /** 隐藏交互loading */
  public hideSpinning () {
    const $spinning: any = this.$spinning
    if ($spinning) {
      $spinning.fadeOut(() => $spinning.remove())
    }
    return this
  }

  public validateForm (field?: string) {
    const { option, data } = this
    const inputs = option.inputs as UiInputOption[]
    const validate = typeof option.validate === 'function' ? option.validate : null
    let isPassValid = true

    // 没有可验证的字段
    if (!inputs || !inputs.length) return isPassValid
    // 寻找验证器，验证器分为全局验证器和局部验证器，通过遍历inputs读取
    for (const input of inputs) {
      const key = input.name
      // 验证指定字段
      if (field && field !== key) {
        continue
      }
      const value = data[key]
      // 局部验证器
      if (typeof input.validate === 'function') {
        const ret = input.validate(value)
        if (!this._validInput(input, ret)) {
          isPassValid = false
          continue
        }
      }
      if (validate) {
        const ret = validate(key, value, data)
        if (!this._validInput(input, ret)) {
          isPassValid = false
        }
      }
    }
    return isPassValid
  }

  public validateClear (field?: string) {
    const { option, data } = this
    const inputs = option.inputs || []
    for (const input of inputs) {
      const key = input.name
      // 验证指定字段
      if (field && field !== key) {
        continue
      }
      this._validInput(input, true)
    }
    return true
  }

  private _validInput (input: UiInputOption, ret: any) {
    const $form = this.$form as any
    const $error = $form.find('.' + classPrefix('modal-field-' + input.name) + ' .' + classPrefix('modal-input-error'))
    // 验证通过
    if (ret === true || ret == null) {
      $error.text('')
      return true
    }
    $error.text(typeof ret === 'string' ? ret : '此项填写错误，请检查。')
    return false
  }

  // 准备打开
  private _openHook () {
    const { $root, $modal, id } = this
    // 渲染结构
    const { title, header, content, footer, buttons, inputs, showClose } = this.option
    const modalElements: ZeptoCollection[] = []
    if (title) {
      modalElements.push(createClsElement('modal-title', title))
      if (showClose) {
        const $el = createClsElement('modal-close', createSdkIcon('close'))
        modalElements.push($el)
        $el.on('click', this.close.bind(this))
      }
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
      for (const { type, label, tips, value = '', validate, innerHTML, ...attrs } of inputs) {
        const tagName = type !== tagTextarea ? 'input' : tagTextarea
        const $input = type === 'custom' ? $(innerHTML) : $(`<${tagName}>`).attr('type', type || 'text')
        const inputId = `${id}__i${++dataIndex}`
        $input.attr('id', inputId).attr(attrs).val(value == null ? '' : value)
        const labelHtml = label ? `<label for="${inputId}">${label || ''} ${tips ? `<span>${tips}</span>` : ''}</label>` : ''
        const $inputWrap = createClsElement('modal-iptwrap', labelHtml).addClass(classPrefix('modal-field-' + (attrs.name || dataIndex)))
        const $inputCont = createClsElement('modal-input', $input)
        const $inputErr = createClsElement('modal-input-error', '')
        $inputWrap.append($inputCont)
        $inputWrap.append($inputErr)
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
