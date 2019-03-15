// @flow
// An event handler can take an optional event argument
// and should not return a value
type EventHandler = (event?: any) => void;
type WildCardEventHandler = (type: string, event?: any) => void

// An array of all currently registered event handlers for a type
type EventHandlerList = EventHandler[];
type WildCardEventHandlerList = WildCardEventHandler[];
// A map of event types and their corresponding event handlers.
type EventHandlerMap = {
  [key: string]: EventHandlerList | WildCardEventHandlerList,
};

export default class Emitter {
  private $emitters: EventHandlerMap = Object.create(null)
  // 读取默认的emiiter
  get $emitter (): WildCardEventHandlerList {
    return this.$emitters['*'] || []
  }
  private $getEmitter(type: string): any[] {
    const map = this.$emitters
    let target = map[type]
    if (!target) {
      target = map[type] = []
    }
    return target
  }

  /**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
  on(type: string, handler: EventHandler) {
    this.$getEmitter(type).push(handler)
    return this
  }

  /**
   * Remove an event handler for the given type.
   *
   * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
   * @param  {Function} handler Handler function to remove
   * @memberOf mitt
   */
  off(type: string, handler: EventHandler) {
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
   * @memberOf mitt
   */
  emit(type: string, a?: any, b?: any) {
    const _this = this
    const list = _this.$emitters[type]
    if (list) {
      for (const handler of list) {
        handler.call(_this, a, b)
      }
    }
    return this
  }
}