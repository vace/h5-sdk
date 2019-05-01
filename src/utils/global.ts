/** @ignore 全局window变量 */
const global: Window = window

/** @ignore Location */
export const location = global.location

/** @ignore Document */
export const document = global.document

/** @ignore Wx */
export const getwx = () => (global as any).wx

/** 是否为微信小程序内部 */
export const isWxMini = () => {
  return global['__wxjs_environment'] === 'miniprogram'
}

/** @ignore fetch */
export const fetch = global.fetch

/** @ignore WeixinJSBridge */
export const WeixinJSBridge = (global as any).WeixinJSBridge

/** @ignore 监听全局事件 */
export const addEventListener = global.addEventListener || ((evt: string, callback: Function) => (global as any).attachEvent('on' + evt, callback))

/** @ignore 移除全局事件 */
export const removeEventListener = global.removeEventListener

/** @ignore Performance */
export const performance = global.performance || {}
