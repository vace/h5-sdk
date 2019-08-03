import { UiAlertOption, UiConfirmOption } from "./interface";

import { wrapModal, wrapAlert, wrapPrompt, wrapConfirm, wrapUserbox } from './ui.promise';

declare var wx: any

export let uiAssetsPath = '/images/ui/'

// 小程序使用参数有此限制
function safeObject(object) {
  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'undefined') {
      delete object[key]
    }
  })
  return object
}

export function alert(option: UiAlertOption): Promise<boolean> {
  return new Promise((resolve) => {
    const arg = {
      title: option.title,
      content: option.content,
      showCancel: false,
      confirmColor: option.cancelColor,
      confirmText: option.okText,
      success() {
        if (typeof option.ok === 'function') {
          option.ok(true)
        }
        resolve(true)
      }
    }
    wx.showModal(safeObject(arg))
  })
}

export function confirm(option: UiConfirmOption): Promise<boolean> {
  return new Promise((resolve) => {
    const arg = {
      title: option.title,
      content: option.content,
      showCancel: true,
      confirmColor: option.cancelColor,
      confirmText: option.okText,
      cancelColor: option.cancelColor,
      cancelText: option.noText,
      success({ confirm, cancel }) {
        if (confirm) {
          typeof option.ok === 'function' && option.ok(true)
          resolve(true)
        } else if (cancel) {
          typeof option.no === 'function' && option.no(true)
          resolve(false)
        }
      }
    }
    wx.showModal(safeObject(arg))
  })
}

const todo = (api: string) => {
  return wx.showToast({ title: '暂未实现接口：' + api, icon: 'none' })
}

export function prompt() {
  return todo('prompt')
}

export function userbox() {
  return todo('userbox')
}

function toastWrapper(icon?: 'success' | 'loading' | 'none' | any): (message: any, duration?: number) => any {
  return (message: any, duration: number = 2000) => {
    const isSystem = ['success', 'loading', 'none'].indexOf(icon) !== -1
    return wx.showToast({
      title: message,
      icon: icon,
      image: isSystem ? undefined : (`${uiAssetsPath}/${icon}/.svg`),
      duration: duration,
      mask: false
    })
  }
}

/** 显示toast */
export const toast = toastWrapper('none')
/** 显示toast-tips */
export const tips = toast
/** 显示toast-success */
export const success = toastWrapper('success')
/** 显示toast-info */
export const info = toastWrapper('info')
/** 显示toast-warn */
export const warn = toastWrapper('warn')
/** 显示toast-error */
export const error = toastWrapper('err')
/** 显示toast-loading */
export const loading = toastWrapper('loading')

export const view = () => todo('view')
export const image = () => todo('image')

export const preloader = (content: string = '请稍后...') => {
  wx.showLoading({ title: content, mask: true })
  wx.showNavigationBarLoading()
  return {
    close() {
      wx.closeLoading()
      wx.hideNavigationBarLoading()
    }
  }
}
export const music = () => todo('music')

export const $modal = (option: any) => todo('$modal')

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


export const $prompt = (option: any) => todo('$prompt')

export const $userbox = (option: any) => todo('$userbox')

