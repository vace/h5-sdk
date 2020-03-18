// @flow
// An event handler can take an optional event argument
// and should not return a value
type EventHandler = (event?: any, a1?: any, a2?: any) => void;
type WildCardEventHandler = (type: string, event?: any, a1?: any, a2?: any) => void
type AllowEventHandler = EventHandler | WildCardEventHandler
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  [key: string]: AllowEventHandler[],
};

/**
 * 事件处理
 * @class Emitter
 */
export default class Emitter {
  /** 单例缓存 */
  protected static _instance: Emitter

  /** 获取单例模式下的emitter */
  public static get instance () {
    if (!this._instance) {
      this._instance = new Emitter()
    }
    return this._instance
  }

  /** 缓存监听的实例对象 */
  private $emitters: EventHandlerMap = Object.create(null)

  /**
   * 注册指定事件，返回解绑事件句柄
   * @param  {String} type	Type of event to listen for, or `"*"` for all events
   * @param  {Function} handler Function to call in response to given event
   */
  public on(type: string, handler: EventHandler) {
    const $emitters = this.$emitters
    const emitter = $emitters[type] || ($emitters[type] = [])
    emitter.push(handler)
    return () => this.off(type, handler)
  }

  /**
   * 监听一次后销毁
   * @param {string} type
   * @param {EventHandler} handler
   */
  public once (type: string, handler: EventHandler) {
    const unbind = this.on(type, (a: any, b: any) => {
      handler.call(this, a, b)
      unbind()
    })
    return unbind
  }

  /**
   * 解绑监听事件句柄
   *
   * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
   * @param  {Function} handler Handler function to remove
   */
  public off(type: string, handler: EventHandler) {
    const list = this.$emitters[type]
    if (list && list.length) {
      const index = list.indexOf(handler)
      index !== -1 && list.splice(index, 1)
    }
    return this
  }

  /**
   * Invoke all handlers for the given type.
   * If present, `"*"` handlers are invoked after type-matched handlers.
   *
   * @param {String} type  The event type to invoke
   * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
   */
  public emit(type: string, a?: any, b?: any) {
    const $emitters = this.$emitters
    const callList = $emitters[type]
    if (callList && callList.length) {
      for (const handler of callList) handler.call(this, a, b)
    }
    const callAll = $emitters['*']
    if (callAll && callAll.length) {
      for (const handler of callAll) handler.call(this, a, b)
    }
    return this
  }
}
