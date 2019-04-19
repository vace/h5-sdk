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

  private $emitters: EventHandlerMap = Object.create(null)
  // 读取默认的emiiter
  get $emitter (): AllowEventHandler[] {
    return this.$emitters['*'] || []
  }
  /**
   * 注册指定事件，返回解绑事件句柄
   *
   * @param  {String} type	Type of event to listen for, or `"*"` for all events
   * @param  {Function} handler Function to call in response to given event
   */
  public on(type: string, handler: EventHandler) {
    this.$getEmitter(type).push(handler)
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
    const list = this.$getEmitter(type)
    if (list.length) {
      list.splice(list.indexOf(handler) >>> 0, 1)
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
  emit(type: string, a?: any, b?: any) {
    const _this = this
    const list = _this.$emitters[type]
    if (list && list.length) {
      const copy = [...list]
      for (const handler of copy) {
        handler.call(_this, a, b)
      }
    }
    const all = _this.$emitter
    if (all && all.length) {
      const copy = [...all]
      for (const handler of copy) {
        handler.call(this, type, a, b)
      }
    }
    return this
  }

  private $getEmitter(type: string): any[] {
    const map = this.$emitters
    let target = map[type]
    if (!target) {
      target = map[type] = []
    }
    return target
  }
}
