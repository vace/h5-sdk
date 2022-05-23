import { object } from '../functions/common'

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
 */
export default class Emitter {
  /** 单例缓存 */
  public static instance: Emitter = new Emitter

  /** 缓存监听的实例对象 */
  private [EmitterSymbol]: EventHandlerMap = object()

  /**
   * 注册指定事件，返回解绑事件句柄
   * @param event 事件名称 `*` 为监听全部事件
   * @param handler 事件回调
   */
  public on(event: string, handler: IEmitterEventHandler) {
    const $emitters = this[EmitterSymbol]
    const emitter = $emitters[event] || ($emitters[event] = [])
    emitter.push(handler)
    return () => this.off(event, handler)
  }

  /**
   * @alias on
   */
  public addEventListener (event: string, handler: IEmitterEventHandler) {
    return this.on(event, handler)
  }

  /**
   * 监听一次指定事件并自动销毁
   * @param event 事件名称
   * @param handler 事件回调
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
   * @param event	Type of event to unregister `handler` from, or `"*"`
   * @param handler Handler function to remove
   */
  public off(event: string, handler: IEmitterEventHandler) {
    const list = this[EmitterSymbol][event]
    if (list && list.length) {
      const index = list.indexOf(handler)
      index !== -1 && list.splice(index, 1)
    }
    return this
  }

  /**
   * @alias off
   */
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
  /**
   * 使用参数，触发事件，如果传递 `*` 则触发所有事件
   * @param event 事件名称
   * @param arg1 传递参数1
   * @param arg2 传递参数2
   */
  public emit(event: string, arg1?: any, arg2?: any) {
    const $emitters = this[EmitterSymbol]
    const callList = $emitters[event]
    if (callList && callList.length) {
      for (const handler of callList) handler.call(this, arg1, arg2)
    }
    const callAll = $emitters['*']
    if (callAll && callAll.length) {
      for (const handler of callAll) handler.call(this, event, arg1, arg2)
    }
    return this
  }
}
