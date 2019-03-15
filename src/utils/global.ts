const global: Window = window

export const location = global.location
export const document = global.document

export const wx = (global as any).wx
export const fetch = global.fetch
export const WeixinJSBridge = (global as any).WeixinJSBridge
// 降级访问
export const addEventListener = global.addEventListener || ((evt: string, callback: Function) => (global as any).attachEvent('on' + evt, callback))

export const removeEventListener = global.removeEventListener

export const performance = global.performance || {}
