import { assign } from 'es6-object-assign'

import UiModal, { UiModalOption } from '../../factory/UiModal'
import UiToast, { UiToastOption } from '../../factory/UiToast';
import UiMusic, { UiMusicOption } from '../../factory/UiMusic';
import UiView, { UiViewOption } from '../../factory/UiView';

import { isObject, isNumber, isFunction } from '../../functions/is';
import { each } from '../../functions/underscore';
import { UiAlertOption, UiConfirmOption, UiPromptOption, UiUserboxOption } from './interface';
import { wrapModal, wrapAlert, wrapPrompt, wrapConfirm, wrapUserbox } from './ui.promise';
import { regexMobile, regexChinese } from '../../functions/regex';

const closeHelper = (modal: UiModal) => modal.close()

/**
 * 打开一个Modal
 * @param {UiModalOption} option
 * @returns {UiModal}
 */
export function modal(option: UiModalOption): UiModal {
  return new UiModal(option).open()
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
    { label, onClick, key: 'ok', href }
  ]
  return new UiModal(option).open()
}

/**
 * 打开一个confirm弹窗
 * @param {UiConfirmOption} option
 * @returns {UiModal}
 */
export function confirm(option: UiConfirmOption): UiModal {
  const { okText = '确定', noText = '取消', ok, no, isForm } = option
  let wrapOkCallback = ok

  // 函数包装，表单需要验证通过
  if (isForm && typeof ok === 'function') {
    wrapOkCallback = (e: UiModal) => {
      if (e.validateForm()) {
        return ok(e)
      }
      return option.formError && error(option.formError)
    }
  }
  option.buttons = [
    { label: noText, key: 'no', onClick: no || closeHelper },
    { label: okText, key: 'ok', onClick: wrapOkCallback || closeHelper, bold: true }
  ]
  return new UiModal(option).open()
}

/**
 * 打开一个prompt
 * @param {UiPromptOption | string} option
 * @returns {UiModal}
 */
export function prompt(option: UiPromptOption | string): UiModal {
  if (typeof option === 'string') {
    option = { title: option }
  }
  const { defaultValue, type, placeholder } = option
  option.inputs = [
    { name: 'value', type, value: defaultValue, placeholder, validate: option.validate }
  ]
  // 去除原有的验证器名称冲突
  delete option.validate
  option.isForm = true
  return confirm(option)
}

let _$cacheMapProfile: any

/**
 * 打开自定义输入面板
 * @param {UiUserboxOption} option
 * @returns {UiModal}
 */
export function userbox(option: UiUserboxOption): UiModal {
  let { profile } = option
  if (!_$cacheMapProfile) {
    _$cacheMapProfile = {
      username: { type: 'text', name: 'username', placeholder: '点击输入姓名', label: '姓名', tips: '请输入您的姓名', min: 2, max: 20, validate: function (value: string) {
        if (!value) {
          return '姓名不能为空'
        }
        if (regexChinese.test(value)) {
          if (value.length < 2) return '姓名不能少于两个汉字'
          else if (value.length > 4) return '姓名不能多于四个汉字'
        } else if (/^[ a-zA-Z]+$/.test(value)) {
          if (value.length < 3) return '英文名不能少于三个字符'
          else if (value.length > 20) return '英文名字母过多'
        } else {
          return '输入包含特殊字符，请正确输入'
        }
        return true
      } },
      mobile: { type: 'tel', name: 'mobile', placeholder: '点击输入手机号', label: '手机', tips: '请输入11位手机号码', min: 11, max: 11, validate: function (mobile: string) {
        if (!mobile) {
          return '手机号码不能为空'
        }
        return regexMobile.test(mobile) ? true : '请填写11位国内手机号码'
      } },
      password: { type: 'password', name: 'password', placeholder: '点击输入密码', label: '密码', tips: '请输入您的密码', validate: (pwd: string) => {
        if (pwd.length < 6) return '密码不能低于6位数字'
      }},
      address: { type: 'textarea', name: 'address', placeholder: '点击输入地址', label: '地址', tips: '请输入您的联系地址', validate: (addr: string) => {
        if (addr.length > 64) return '地址输入内容过多，请检查输入'
      } },
      hidden: { type: 'hidden', name: 'hidden' }
    }
  }
  if (!profile) {
    profile = ['username', 'mobile']
  }
  const inputs = option.inputs || []
  each(profile, (data, index) => {
    if (typeof index === 'string') {
      const input = assign({}, _$cacheMapProfile[index])
      if (isObject(data)) {
        assign(input, data)
      } else {
        input.value = data
      }
      inputs.push(input)
    } else {
      inputs.push(_$cacheMapProfile[data])
    }
  })
  option.inputs = inputs
  option.isForm = true
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
export function view(option: UiViewOption): UiView {
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
export function preloader(content: string = '请稍后...'): UiView {
  return view({ type: 'preloader', content })
}

/**
 * !注意，一个应用一般只有一个播放器，所以为单例模式
 * 如果需要多个实例，通过 `new ui.UiMusic(option) 创建`
 * @param {(string | UiMusicOption)} option
 * @returns {UiMusic}
 */
export function music(option: string | UiMusicOption): UiMusic {
  if (typeof option === 'string') {
    option = { src: option }
  }
  return UiMusic.createInstance(option)
}


/**
 * 打开一个modal弹窗，返回按钮key，取消时key=undefined
 * @param {UiModalOption} option
 */
export const $modal = (option: UiModalOption) => wrapModal(modal, option)

/**
 * 打开一个alert弹窗，用户点击确定，返回true
 * @param {UiAlertOption} option
 */
export const $alert = (option: UiAlertOption) => wrapAlert(alert, option)

/**
 * 打开一个confirm弹窗，返回true,false
 * @example
 * ```js
 * var isOk = await ui.$confim({title: '确认吗？', content: '内容'})
 * ```
 * @param {UiConfirmOption} option
 */
export const $confirm = (option: UiConfirmOption) => wrapConfirm(confirm, option)

/**
 * 打开一个prompt弹窗，返回输入内容，取消返回undefined
 * @example
 * ```js
 * var content = await ui.$prompt({title: '输入内容', content: '请在输入框输入内容'})
 * ```
 * @param {UiPromptOption} option
 */
export const $prompt = (option: UiPromptOption) => wrapPrompt(prompt, option)

/**
 * 打开一个userbox弹窗，返回输入对象，取消返回undefined
 * @param {UiUserboxOption} option
 */
export const $userbox = (option: UiUserboxOption) => wrapUserbox(userbox, option)
