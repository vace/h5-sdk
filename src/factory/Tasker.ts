/**
 * 用法实例
 */

const HandleSymbol = Symbol('tasker')
const PromiseSymbol = Symbol('promise')

type PromiseHandle = {
  resolve: ITaskerResolve,
  reject: ITaskerReject
}

type ITaskerResolve = (value: any | PromiseLike<any>) => void
type ITaskerReject = (reason?: Error | any) => void

/**
 * ! typescript extends Promise 解析到es5有bug，所以暂时用此方式实现
 * ! _super.call(this, ...) || this
 */
export default class Tasker {
  public [PromiseSymbol]: Promise<any>
  public [HandleSymbol]: PromiseHandle
  /** 是否已被resolved/reject */
  public isResolved: boolean = false

  public constructor() {
    const handle: any = {}
    this[PromiseSymbol] = new Promise((resolve, reject) => {
      handle.resolve = resolve
      handle.reject = reject
    })
    this[HandleSymbol] = handle as PromiseHandle
  }

  public then (onfulfilled: ITaskerResolve, onrejected?: ITaskerReject ) {
    return this[PromiseSymbol].then(onfulfilled, onrejected)
  }
  public catch (onrejected: ITaskerReject) {
    return this[PromiseSymbol].catch(onrejected)
  }
  public finally (onfinally: ITaskerReject) {
    return this[PromiseSymbol].finally(onfinally)
  }
  public resolve (val: any) {
    this.isResolved = true
    this[HandleSymbol].resolve(val)
    return this
  }
  public reject (err?: Error) {
    this.isResolved = true
    this[HandleSymbol].reject(err)
    return this
  }
}
