import '../assets/ui-view.less'
import starLoadingSvg from '../assets/star-loading'

import { UiBase, UiBaseOption } from "./UiBase";
import { createClsElement, createSdkIcon, classPrefix } from "../utils/shared";

export interface UiViewOption extends UiBaseOption {
  /* image: 图片预览, preloader: 加载动画 */
  type: 'image' | 'preloader'
  isFullScreen?: boolean // 是否全屏
  src?: string // 图片路径
  alt?: string // 图片描述
  content?: string // 追加内容
  icon?: string // 附加图标
  iconPosition?: 'tl' | 'tr' | 'bl' | 'br' | 'center' // 图标位置
  onClick?: Function // icon click
}

export class UiView extends UiBase {
  public static option = {
    isAddMask: true,
    target: 'body',
    iconPosition: 'center',
    // 默认的图标点击事件
    onClick: function (this: UiView) {
      this.close()
    }
  }

  public $view: ZeptoCollection
  public $content?: ZeptoCollection
  constructor (_option: UiViewOption) {
    super(Object.assign({}, UiView.option, _option))
    this.$view = createClsElement('view')
    // icon click event
    this.$root.append(this.$view).on('click', '.' + classPrefix('view-icon'), () => {
      const { onClick } = this.option
      if (typeof onClick === 'function') {
        onClick.call(this, this)
      }
    })
    this.on('open', this._openHook.bind(this))
  }
  private _openHook () {
    const $view = this.$view
    const { type, src, alt = '', content, icon, isFullScreen, iconPosition } = (this.option as UiViewOption)
    if (type === 'image') {
      $view.append(createClsElement('view-image', undefined, 'img').attr({ src, alt }))
    } else if (type === 'preloader') {
      $view.append(createClsElement('view-preloader', starLoadingSvg))
    }
    if (content) {
      $view.append(this.setContent(content))
    }
    if (icon) {
      const $icon = createClsElement('view-icon', createSdkIcon(icon)).addClass(classPrefix(`pos-${iconPosition}`))
      $view.append($icon)
    }
    $view.toggleClass(classPrefix('view-full'), !!isFullScreen)
  }

  // 重新设置内容
  public setContent (content: string) {
    if (!this.$content) {
      this.$content = createClsElement('view-content')
    }
    return (this.$content.html('').append(content) as any).fadeIn()
  }
}
