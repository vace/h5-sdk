import BaseEmitter, { EmitterSymbol } from './Emitter'

class AbortSignal extends BaseEmitter {
  public aborted: boolean = false
  public onabort!: any

  dispatchEvent(event: any) {
    if (event.type === 'abort') {
      this.aborted = true
      if (typeof this.onabort === 'function') {
        this.onabort.call(this, event)
      }
    }
    const stack = this[EmitterSymbol][event.type]
    if (!stack || !stack.length) {
      return
    }
    const debounce = callback => {
      setTimeout(() => callback.call(this, event));
    }
    for (let i = 0, l = stack.length; i < l; i++) {
      debounce(stack[i])
    }
    return !event.defaultPrevented
  }
  toString() {
    return '[object AbortSignal]';
  }
}

export default class AbortController {
  public signal = new AbortSignal

  abort() {
    const event = {
      type: 'abort',
      bubbles: false,
      cancelable: false
    }
    this.signal.dispatchEvent(event)
  }
  toString() {
    return '[object AbortController]';
  }
}
