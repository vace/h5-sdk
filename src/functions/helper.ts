import { document } from "../utils/global";


/** 监听事件 */
export function addListener(element: HTMLElement | Document, event: string, callback: EventListener): Function {
  element.addEventListener(event, callback, false);
  return function unbind() {
    element.removeEventListener(event, callback, false);
  };
}

/** 页面是否就绪 */
export const domready: Promise<boolean> = /comp|inter|loaded/.test(document.readyState) ? Promise.resolve(true) : new Promise((resolve) => {
  const onDocumentLoaded = () => {
    unbind1()
    unbind2()
    resolve(true)
  }
  const unbind1 = addListener(document, 'DOMContentLoaded', onDocumentLoaded)
  const unbind2 = addListener(document, 'load', onDocumentLoaded)
})
