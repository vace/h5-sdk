import UiModal, { UiModalOption } from '../factory/UiModal'
import UiToast, { UiToastOption } from '../factory/UiToast';
import UiMusic, { UiMusicOption } from '../factory/UiMusic';
import UiView, { UiViewOption } from '../factory/UiView';

import { isObject, isNumber, isFunction } from '../functions/is';
import { each } from '../functions/underscore';
import { UiInputType } from '../factory/UiBase';

const closeHelper = (modal: UiModal) => modal.close()

/**
 * 打开一个Modal
 * @param {UiModalOption} option
 * @returns {UiModal}
 */
export function modal (option: UiModalOption): UiModal {
  return new UiModal(option).open()
}

/** UiAlert 配置 */
interface UiAlertOption extends UiModalOption {
  /** 点击链接可选 */
  href?: string
  /** 按钮名称 */
  okText?: string
  /** 按钮点击回调事件 */
  ok?: Function
}

/**
 * 打开一个Alert弹窗
 * @param {(UiAlertOption | string)} option
 * @returns {UiModal}
 */
export function alert(option: UiAlertOption | string): UiModal {
  // 文本处理
  if (typeof option === 'string') {
    option = { content: option }
  }
  const { okText: label = '确定', ok: onClick = closeHelper, href } = option
  option.buttons = [
    { label, onClick, key: 'ok', href}
  ]
  return new UiModal(option).open()
}

/** UiConfirm配置 */
interface UiConfirmOption extends UiAlertOption {
  /** 关闭按钮文字 */
  noText?: string
  /** 关闭按钮回调 */
  no?: Function
}

/**
 * 打开一个confirm弹窗
 * @param {UiConfirmOption} option
 * @returns {UiModal}
 */
export function confirm (option: UiConfirmOption): UiModal {
  const { okText = '确定', noText = '取消', ok, no } = option
  option.buttons = [
    { label: noText, key: 'no', onClick: no || closeHelper },
    { label: okText, key: 'ok', onClick: ok || closeHelper, bold: true }
  ]
  return new UiModal(option).open()
}

/** UiPrompt 配置 */
interface UiPromptOption extends UiConfirmOption {
  /** 输入种类 */
  type?: UiInputType
  /** 输入默认值 */
  defaultValue?: string,
  /** 默认输入内容 */
  placeholder?: string
}

/**
 * 打开一个prompt
 * @param {UiPromptOption | string} option
 * @returns {UiModal}
 */
export function prompt (option: UiPromptOption | string): UiModal {
  if (typeof option === 'string') {
    option = { title: option }
  }
  const { defaultValue, type, placeholder } = option
  option.inputs = [
    { name: 'value', type, value: defaultValue, placeholder }
  ]
  return confirm(option)
}

type UserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden'
/** UserBox类型 */
interface UiUserboxOption extends UiConfirmOption {
  title: string
  profile: UserProfileType[]
}
let _$cacheMapProfile: any

/**
 * 打开自定义输入面板
 * @param {UiUserboxOption} option
 * @returns {UiModal}
 */
export function userbox (option: UiUserboxOption): UiModal {
  let { profile } = option
  if (!_$cacheMapProfile) {
    _$cacheMapProfile = {
      username: { type: 'text', name: 'username', placeholder: '点击输入姓名', label: '姓名', tips: '请输入您的姓名', min: 2, max: 12 },
      mobile: { type: 'tel', name: 'mobile', placeholder: '点击输入手机号', label: '手机', tips: '请输入11位手机号码', min: 11, max: 11 },
      password: { type: 'password', name: 'password', placeholder: '点击输入密码', label: '密码', tips: '请输入您的密码' },
      address: { type: 'textarea', name: 'address', placeholder: '点击输入地址', label: '地址', tips: '请输入您的联系地址' },
      hidden: { type: 'hidden', name: 'hidden' }
    }
  }
  if (!profile) {
    profile = [ 'username', 'mobile' ]
  }
  const inputs = option.inputs || []
  each(profile, (data, index) => {
    if (typeof index === 'string') {
      const input = Object.assign({}, _$cacheMapProfile[index])
      if (isObject(data)) {
        Object.assign(input, data)
      } else {
        input.value = data
      }
      inputs.push(input)
    } else{
      inputs.push(_$cacheMapProfile[data])
    }
  })
  option.inputs = inputs
  return confirm(option)
}

function toastWrapper(icon?: 'success' | 'info' | 'sorry' | 'err' | 'loading'): (message: any, duration?: any, onClose?: any) => UiToast {
  return (message: any, duration: any, onClose: any): UiToast => {
    const option: UiToastOption = isObject(message) ? message : { message }
    if (icon) {
      option.icon = icon
    }
    // true 为默认时间
    if (isNumber(duration)) {
      option.duration = duration
    } else if (icon !== 'loading') { // 自动关闭
      option.duration = true
    }
    if (isFunction(duration)) {
      option.onClose = duration
    }
    if (isFunction(onClose)) {
      option.onClose = onClose
    }
    return new UiToast(option).open()
  }
}

/** 显示toast */
export const toast = toastWrapper()
/** 显示toast-tips */
export const tips = toastWrapper()
/** 显示toast-success */
export const success = toastWrapper('success')
/** 显示toast-info */
export const info = toastWrapper('info')
/** 显示toast-warn */
export const warn = toastWrapper('sorry')
/** 显示toast-error */
export const error = toastWrapper('err')
/** 显示toast-loading */
export const loading = toastWrapper('loading')

/**
 * 打开自定义view
 * @param {UiViewOption} option
 * @returns {UiView}
 */
export function view (option: UiViewOption): UiView {
  return new UiView(option).open()
}

/**
 * 预览图片，支持全屏/半屏
 * @param {(UiViewOption | string)} option
 * @param {boolean} [isFullScreen]
 * @returns {UiView}
 */
export function image(option: UiViewOption | string, isFullScreen?: boolean): UiView {
  if (typeof option === 'string') {
    option = { type: 'image', src: option, isFullScreen, icon: 'close' }
  } else {
    option.type = 'image'
    if (!option.icon) {
      option.icon = 'close'
    }
  }
  return view(option)
}

/**
 * 展示全局的加载动画
 * @param {string} [content='请稍后...']
 * @returns {UiView}
 */
export function preloader (content: string = '请稍后...'): UiView {
  return view({ type: 'preloader', content })
}

/**
 * !注意，一个应用一般只有一个播放器，所以为单例模式
 * 如果需要多个实例，通过 `new ui.UiMusic(option) 创建`
 * @param {(string | UiMusicOption)} option
 * @returns {UiMusic}
 */
export function music (option: string | UiMusicOption): UiMusic {
  if (typeof option === 'string') {
    option = { src: option }
  }
  return UiMusic.getInstance(option)
}
