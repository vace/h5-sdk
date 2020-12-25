// @flow
// An event handler can take an optional event argument
// and should not return a value
type IEmitterEventHandler = (event?: any, a1?: any, a2?: any) => void;
type IEmitterWildCardEventHandler = (type: string, event?: any, a1?: any, a2?: any) => void
type IEmitterAllowEventHandler = IEmitterEventHandler | IEmitterWildCardEventHandler
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  [key: string]: IEmitterAllowEventHandler[],
};

export const EmitterSymbol = Symbol('emitter')

/**
 * 事件处理
 * @class Emitter
 */
export default class Emitter {
  /** 单例缓存 */
  public static instance: Emitter = new Emitter

  /** 缓存监听的实例对象 */
  private [EmitterSymbol]: EventHandlerMap = Object.create(null)

  /**
   * 注册指定事件，返回解绑事件句柄
   * @param  {String} event	Type of event to listen for, or `"*"` for all events
   * @param  {Function} handler Function to call in response to given event
   */
  public on(event: string, handler: IEmitterEventHandler) {
    const $emitters = this[EmitterSymbol]
    const emitter = $emitters[event] || ($emitters[event] = [])
    emitter.push(handler)
    return () => this.off(event, handler)
  }

  public addEventListener (event: string, handler: IEmitterEventHandler) {
    return this.on(event, handler)
  }

  /**
   * 监听一次后销毁
   * @param {string} event
   * @param {IEmitterEventHandler} handler
   */
  public once (event: string, handler: IEmitterEventHandler) {
    const unbind = this.on(event, (a: any, b: any) => {
      handler.call(this, a, b)
      unbind()
    })
    return unbind
  }

  /**
   * 解绑监听事件句柄
   *
   * @param  {String} event	Type of event to unregister `handler` from, or `"*"`
   * @param  {Function} handler Handler function to remove
   */
  public off(event: string, handler: IEmitterEventHandler) {
    const list = this[EmitterSymbol][event]
    if (list && list.length) {
      const index = list.indexOf(handler)
      index !== -1 && list.splice(index, 1)
    }
    return this
  }

  public removeEventListener (event: string, handler: IEmitterEventHandler) {
    return this.off(event, handler)
  }

  /**
   * Invoke all handlers for the given type.
   * If present, `"*"` handlers are invoked after type-matched handlers.
   *
   * @param {String} event  The event type to invoke
   * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
   */
  public emit(event: string, a?: any, b?: any) {
    const $emitters = this[EmitterSymbol]
    const callList = $emitters[event]
    if (callList && callList.length) {
      for (const handler of callList) handler.call(this, a, b)
    }
    const callAll = $emitters['*']
    if (callAll && callAll.length) {
      for (const handler of callAll) handler.call(this, event, a, b)
    }
    return this
  }
}
