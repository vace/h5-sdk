export interface ITaskerPromise<T> extends Promise<T> {
  resolved: boolean
  resolve(val: T): Promise<T>
  reject(err?: Error): Promise<T>
}

/**
 * 创建一个同步promise任务，在需要时手动resolve
 * @example
 * var task = sdk.tasker()
 * task.then(console.log)
 * task.resolve(data)
 */
export default function tasker<T>(): ITaskerPromise<T> {
  const handler: any = {}

  const promise = <ITaskerPromise<T>> new Promise((resolve, reject) => {
    handler.resolve = resolve
    handler.reject = reject
  })

  promise.resolved = false

  // promise.abort = (reason) => {}

  /** resolve promise */
  promise.resolve = (val: T) => {
    promise.resolved = true
    handler.resolve(val)
    return promise
  }

  /** reject promise */
  promise.reject = (err?: Error) => {
    handler.reject(err)
    return promise
  }

  return promise
}
