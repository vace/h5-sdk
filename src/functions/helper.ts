import { document } from "../utils/global";


/** 监听事件 */
export function addListener(element: Window | HTMLElement | Document, event: string, callback: EventListener): Function {
  element.addEventListener(event, callback, false);
  return function unbind() {
    element.removeEventListener(event, callback, false);
  };
}

// 只有在document模式下有此状态
const isLoadComplete = !document || /comp|inter|loaded/.test(document.readyState)

/** 页面是否就绪 */
export const domready: Promise<boolean> = isLoadComplete ? Promise.resolve(true) : new Promise((resolve) => {
  const onDocumentLoaded = () => {
    unbind1()
    unbind2()
    resolve(true)
  }
  const unbind1 = addListener(document, 'DOMContentLoaded', onDocumentLoaded)
  const unbind2 = addListener(document, 'load', onDocumentLoaded)
})
