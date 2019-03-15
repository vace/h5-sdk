import { document } from "../utils/global";

/**
 * 监听事件
 * @param {HTMLElement} element
 * @param {string} event
 * @param {EventListener} callback
 * @returns {Function} 解绑函数
 */
export function addListener(element: HTMLElement | Document, event: string, callback: EventListener): Function {
  element.addEventListener(event, callback, false);
  return function unbind() {
    element.removeEventListener(event, callback, false);
  };
}

export const domready = /comp|inter|loaded/.test(document.readyState) ? Promise.resolve(true) : new Promise((resolve) => {
  const onDocumentLoaded = () => {
    unbind1()
    unbind2()
    resolve()
  }
  const unbind1 = addListener(document, 'DOMContentLoaded', onDocumentLoaded)
  const unbind2 = addListener(document, 'load', onDocumentLoaded)
})
