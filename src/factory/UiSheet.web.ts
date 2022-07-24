import type { ZeptoCollection } from '../types/zepto'
import $ from '../venders/zepto.js';

import UiBase, { UiBaseOption, UiButtonOption, classPrefix, createClsElement } from "./UiBase.web";
import { noop, assign } from '../functions/common'

interface IUiSheetAction extends UiButtonOption {}

/** UIsheet配置 */
export interface IUiSheetOption extends UiBaseOption {
  /** 标题 */
  title?: string
  /** 操作按钮列表 */
  menus?: IUiSheetAction[]
  /** 第二栏按钮列表 */
  actions?: IUiSheetAction[]
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
}

export default class UiSheet extends UiBase {
  /** 全局配置 */
  public static option: IUiSheetOption = {
    isAddMask: true,
    maskClose: true,
    theme: 'ios',
    target: 'body',
    onClick: noop
  }

  /** 弹层实例 */
  public $sheet: ZeptoCollection

  constructor(_option: IUiSheetOption = {}) {
    super(assign({}, UiSheet.option, _option))
    // 挂载
    this.$sheet = createClsElement('sheet')
    // bind event
    const _this = this
    this.$root.append(this.$mask).on('click', '.' + classPrefix('sheet-button'), function (this: any, evt) {
      const key = $(this).data('key') // maybe string
      const { actions = [], menus = [], onClick: globalOnClick = noop } = _this.option
      const findKey = actions => actions.find((f) => f.key == key)
      const button = findKey(actions) || findKey(menus)
      if (button) {
        button.onClick && button.onClick.call(_this, _this) // 响应事件
        globalOnClick.call(_this, key) // 回调全局事件
        _this.emit('click', key, button) // 触发事件
      }
    })
    this.on('open', this._openHook.bind(this))
    this.on('closed', this._closedHook.bind(this))
  }

  // 打开
  private _openHook() {
    const { $root, $sheet } = this
    // 渲染结构
    const { title, actions, menus } = this.option
    const sheetElements: ZeptoCollection[] = []
    if (title) {
      sheetElements.push(createClsElement('sheet-title', title))
    }

    // 操作节点
    const render = (actions: any[], subClass: string) => createClsElement('sheet-' + subClass, 
      actions.map(({ href, label, bold, className, color, key }) => {
        return `<a data-key="${key}" href="${href || 'javascript:;'}" class="${classPrefix(['sheet-button', bold && 'sheet-bold', `color-${color || 'dark'}`])} ${className || ''}">${label}</a>`
      }
    ).join(''))

    sheetElements.push(render(menus, 'menus'))
    sheetElements.push(render(actions, 'actions'))

    // 节点渲染
    for (const $element of sheetElements) {
      $sheet.append($element)
    }
    $root.append($sheet)
  }

  private _closedHook() {
    this.$sheet.html('')
  }
}
