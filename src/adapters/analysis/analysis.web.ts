import { IAnalysis } from "./interface";
import { parse } from "../../functions/qs";
import { addListener, domready } from "../../functions/helper";
import { getCurrentHref } from "../../utils/shared.web";

export default function createAnalysisWeb (): IAnalysis {

  return {
    onShow (fn: any) {
      return domready.then(fn)
    },
    onError (fn) {
      return addListener(window, 'error', fn)
    },
    onUnload (fn) {
      return addListener(window, 'unload', fn)
    },
    getCurrentUrl(privacy: any) {
      return getCurrentHref(privacy)
    },
    getErrorStack(error: Error) {
      if (!(error instanceof Error)) {
        console.log(`error arg must instanceof Error`)
        return ''
      }
      let errorStack: string
      if (error.stack) {
        errorStack = error.stack.split('\n').slice(0, 3).join('\n')
      } else {
        errorStack = error.name + ': ' + error.message
      }
      return errorStack
    },
    getUserAgent() {
      return navigator.userAgent
    },
    getCurrentParam() {
      return parse(location.search.slice(1))
    },
    send(target: string) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = resolve
        image.onerror = reject
        image.src = target
      })
    }
  }
}