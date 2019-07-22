import { IAnalysis } from "./interface";
import { request } from "../request/index";

declare var wx: any
declare var getCurrentPages: any

export default function createAnalysisMini (): IAnalysis {

  function getPageField (field: string) {
    const pages: any[] = getCurrentPages()
    const len = pages.length
    if (!len) return null
    const page = pages[len - 1]
    return page[field]
  }

  return {
    onShow (fn) {
      wx.onAppShow(fn)
      return () => wx.offAppShow(fn)      
    },
    onError (fn: Function) {
      wx.onError(fn)
      return () => wx.offError(fn)
    },
    onUnload (fn: Function) {
      wx.onAppHide(fn)
      return () => wx.offAppHide(fn)
    },
    getErrorStack (error: string) {
      let errorStack = error.split('\n').slice(0, 3).join('\n')
      return errorStack
    },
    getCurrentUrl () {
      return getPageField('route') || ''
    },
    getCurrentParam() {
      const param = getPageField('options') || {}
      param['spm_from'] = 'miniapp'
      return param
    },
    getUserAgent () {
      return ''
    },
    send (target: string) {
      return request({ url: target, method: 'GET' })
    }
  }
}