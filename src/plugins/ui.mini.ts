import { isDef, isFunction, isNumber, isString, wait } from "../functions/common"
import { WxError } from '../functions/utils.mini'

declare var wx: any

// 打开的loading计数
let _ToastOpenId = 0

export const closeAll = () => {
  _ToastOpenId = 0
  wx.hideToast()
}

// base
export const loading = (title = '加载中...', mask = false) => _wrapToast(title, mask, 'loading')
export const success = (title = '操作成功', mask = false) => _wrapToast(title, mask, 'success')
export const error = (title = '操作失败', mask = false) => _wrapToast(title, mask, 'none')
export const preloader = (title = '操作中...', mask = true) => _wrapToast(title, mask, 'loading')

// promise
export const alert = (content: IShowModalOption | string) => _getModalOptions(content)
export const confirm = (content: IShowModalOption | string) => _getModalOptions(content, true)

function _getModalOptions(content: IShowModalOption | string, showCancel = false) {
  let options: IShowModalOption
  if (isString(content)) {
    options = { content }
  } else {
    options = content
  }
  // @ts-ignore
  const { okText: confirmText, noText: cancelText, ok, no } = options
  if (isDef(confirmText)) {
    options.confirmText = confirmText
  }
  if (isDef(cancelText)) {
    options.cancelText = cancelText
  }
  isDef(confirmText) && (options.confirmText = confirmText)
  isDef(cancelText) && (options.cancelText = cancelText)
  options.showCancel = showCancel
  return new Promise((resolve, fail) => {
    options.success = ({ confirm, cancel }) => {
      resolve(!cancel)
      confirm && isFunction(ok) && ok(true)
      cancel && isFunction(no) && no(false)
    }
    options.fail = err => {
      fail(new WxError(err))
      if (isFunction(no)) no(err)
    }
    wx.showModal(options)
  })
}

function _getToastOptions(title: IShowToastOption | string, mask: boolean): IShowToastOption {
  let options: IShowToastOption
  if (isString(title)) {
    options = { title, mask }
  } else {
    options = title
  }
  return options
}

function _wrapToast(title: IShowToastOption | string, mask: boolean, icon: string) {
  const options = _getToastOptions(title, mask)
  let isClosed: boolean
  options.icon = icon
  wx.showToast(options)
  const close = () => {
    if (isClosed) return
    if (_ToastOpenId-- <= 1) {
      isClosed = true
      wx.hideToast()
    }
  }
  const duration = options.duration || 1500
  if (isNumber(duration) && duration >= 0) {
    wait(duration).then(close)
  }
  return { id: _ToastOpenId++, close }
}

interface IShowToastOption {
  title: string
  duration?: number
  icon?: string
  image?: string
  mask?: boolean
}

interface IShowModalOption {
  /** 提示的内容 */
  content?: string
  /** 提示的标题 */
  title?: string
  okText?: string
  showCancel?: boolean
  confirmText?: string
  noText?: string
  cancelText?: string
  ok?: (ret: boolean) => void
  no?: (ret: boolean) => void
  success?: any
  fail?: any
}
