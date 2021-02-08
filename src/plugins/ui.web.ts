import { UiInputType } from '../factory/UiBase.web';
import UiModal, { UiModalOption } from '../factory/UiModal.web'
import UiToast, { UiToastOption } from '../factory/UiToast.web';
import UiMusic, { IUiMusicOption } from '../factory/UiMusic.web';
import UiView, { UiViewOption } from '../factory/UiView.web';
import UiSheet, { IUiSheetOption } from '../factory/UiSheet.web';
import UiTip, { UiTipOption } from '../factory/UiTip.web';

import { assign, isObject, isNumber, isFunction, each, regexMobile, regexChinese, once, map, isString } from '../functions/common';

/** UiAlert 配置 */
export interface IUiAlertOption extends UiModalOption {
  /** 点击链接可选 */
  href?: string
  /** 按钮名称 */
  okText?: string | false
  /** 按钮点击回调事件 */
  ok?: Function
}


/** UiConfirm配置 */
export interface IUiConfirmOption extends IUiAlertOption {
  /** 表单验证失败提示文案 */
  formError?: Function | string
  /** 关闭按钮文字 */
  noText?: string | false
  /** 关闭按钮回调 */
  no?: Function
}


/** UiPrompt 配置 */
export interface IUiPromptOption extends IUiConfirmOption {
  /** 输入种类 */
  type?: UiInputType
  /** 输入默认值 */
  defaultValue?: string,
  /** 默认输入内容 */
  placeholder?: string,
  /** 输入验证器 */
  validate?: (value: string) => any
}


export type IUserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden'
/** UserBox类型 */
export interface IUiUserboxOption extends IUiConfirmOption {
  title: string
  profile: IUserProfileType[]
}

const closeHelper = (modal: UiModal) => modal.close()

/** 打开一个Modal */
export function modal(option: UiModalOption): UiModal {
  return new UiModal(option).open()
}

/** 打开一个提示框 */
export function tip (option: UiTipOption | string) {
  if(typeof option === 'string') {
    option = { message: option }
  }
  return new UiTip(option).open()
}

/** 打开一个Alert弹窗 */
export function alert(option: IUiAlertOption | string): UiModal {
  // 文本处理
  if (typeof option === 'string') {
    option = { content: option }
  }
  const { okText: label = '确定', ok: onClick = closeHelper, href } = option
  // 支持无按钮模式
  if (label !== false) {
    option.buttons = [
      { label, onClick, key: 'ok', href, bold: true }
    ]
  }
  return new UiModal(option).open()
}

/** 打开一个confirm弹窗 */
export function confirm(option: IUiConfirmOption): UiModal {
  const { okText = '确定', noText = '取消', ok, no, isForm } = option
  let wrapOkCallback = ok

  // 函数包装，表单需要验证通过
  if (isForm && typeof ok === 'function') {
    wrapOkCallback = (e: UiModal) => {
      if (e.validateForm()) {
        return ok(e)
      }
      const formError = option.formError as any
      if (typeof formError === 'function') {
        return formError(e)
      } else if (formError) {
        return error(formError === true ? '表单项目填写错误，请检查' : formError)
      }
      return null
    }
  }
  const buttons: any[] = option.buttons = []
  if (noText !== false) {
    buttons.push({ label: noText, key: 'no', onClick: no || closeHelper, bold: true, color: 'dark' })
  }
  if (okText !== false) {
    buttons.push({ label: okText, key: 'ok', onClick: wrapOkCallback || closeHelper, bold: true })
  }
  return new UiModal(option).open()
}

/** 打开一个prompt */
export function prompt(option: IUiPromptOption | string): UiModal {
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

/** 打开一个sheet */
export function sheet (option: IUiSheetOption) {
  return new UiSheet(option).open()
}

const getValidate = once(() => {
  return {
    username: {
      type: 'text', name: 'username', placeholder: '点击输入姓名', label: '姓名', tips: '请输入您的姓名', min: 2, max: 20, validate: function (value: string) {
        if (!value) {
          return '姓名不能为空'
        }
        if (regexChinese.test(value)) {
          if (value.length < 2) return '姓名不能少于两个汉字'
          else if (value.length > 4) return '姓名不能多于四个汉字'
        } else if (/^[a-zA-Z]+$/.test(value)) {
          if (value.length < 3) return '英文名不能少于三个字符'
          else if (value.length > 20) return '英文名字符过多'
        } else {
          return '请输入中文名或英文名'
        }
        return true
      }
    },
    mobile: {
      type: 'tel', name: 'mobile', placeholder: '点击输入手机号', label: '手机', tips: '请输入11位手机号码', min: 11, max: 11, validate: function (mobile: string) {
        if (!mobile) {
          return '手机号码不能为空'
        }
        return regexMobile.test(mobile) ? true : '请填写11位国内手机号码'
      }
    },
    password: {
      type: 'password', name: 'password', placeholder: '点击输入密码', label: '密码', tips: '请输入您的密码', validate: (pwd: string) => {
        if (pwd.length < 6) return '密码不能低于6位数字'
      }
    },
    address: {
      type: 'textarea', name: 'address', placeholder: '点击输入地址', label: '地址', tips: '请输入您的联系地址', validate: (addr: string) => {
        if (addr.length > 64) return '地址输入内容过多，请删减'
      }
    },
    hidden: { type: 'hidden', name: 'hidden' }
  }
})

/** 打开自定义输入面板 */
export function userbox(option: IUiUserboxOption): UiModal {
  const { profile = ['username', 'mobile'], inputs = [] } = option
  const profileList = map(profile, (value, key) => {
    const isKeyMap = isString(key)
    const validater = getValidate()[isKeyMap ? key : value]
    if (isKeyMap) {
      // 支持 {username: 'vace'} 的预备格式
      // 支持 {username: { type: 'text', name: 'username' }}
      return assign({}, validater, isObject(value) ? value : { value })
    }
    // 支持对象嵌套
    return isString(value) ? validater : value
  })
  option.inputs = inputs.concat(profileList)
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
/** 打开自定义view */
export const view = (option: UiViewOption): UiView => new UiView(option).open()
/** 创建music实例 */
export const music = (option: IUiMusicOption) => new UiMusic(option)

/** 预览图片，支持全屏/半屏 */
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

/** 展示全局的加载动画 */
export function preloader(content: string = '请稍后...'): UiView {
  return view({ type: 'preloader', content })
}

/** 打开一个modal弹窗，返回按钮key，取消时key=undefined */
export const $modal = (option: UiModalOption): Promise<null | string> => _wrapPromise(modal, option, (done, option) => {
  option.onClick = function (key) {
    done(this, key)
  }
})

/** 打开一个alert弹窗，用户点击确定，返回true */
export const $alert = (option: IUiAlertOption): Promise<true | null> => _wrapPromise(alert, option, (done, option) => {
  option.ok = (e: UiModal) => done(e, true)
})

/**
 * 打开一个confirm弹窗，返回true,false
 * @example
 * var isOk = await ui.$confim({title: '确认吗？', content: '内容'})
 */
export const $confirm = (option: IUiConfirmOption): Promise<boolean | null> => _wrapPromise(confirm, option, (done, option) => {
  option.ok = (e: UiModal) => done(e, true)
})

/**
 * 打开一个prompt弹窗，返回输入内容，取消返回undefined
 * @example
 * var content = await ui.$prompt({title: '输入内容', content: '请在输入框输入内容'})
 */
export const $prompt = (option: IUiPromptOption): Promise<string | false | null> => _wrapPromise(prompt, option, (done, option) => {
  option.ok = (e: UiModal) => done(e, e.value)
})

/**
 * 打开一个userbox弹窗，返回输入对象，取消返回undefined
 */
export const $userbox = (option: IUiUserboxOption): Promise<object | false | null> => _wrapPromise(userbox, option, (done, option) => {
  option.ok = (e: UiModal) => done(e, e.data)
})

/**
 * 打开一个sheet，返回sheet中的key内容
 */
export const $sheet = (option: IUiSheetOption): Promise<string | null> => _wrapPromise(sheet, option, (done, option) => {
  option.onClick = function (key) {
    done(this, key)
  }
})

function _wrapPromise<T> (fn: Function, option: T, hander: (t: any, opt: T) => void): Promise<any> {
  const task: any = {}
  const promise = new Promise((resolve) => {
    task.resolve = resolve
  })
  const done = (modal: UiModal, value: any) => {
    task.resolve(value)
    modal.close()
  }
  // @ts-ignore
  option.onClose = () => {
    task.resolve(null)
  }
  // @ts-ignore
  option.no = (e: UiModal) => done(e, false)
  hander(done, option)
  // @ts-ignore
  promise.instance = fn(option)
  return promise
}
