export interface ITaskerPromise<T> extends Promise<T> {
  resolve(val: T): Promise<T>
  reject(err?: Error): Promise<T>
}

export default function tasker <T>() {
  const handler: any = {}

  const promise = <ITaskerPromise<T>> new Promise((resolve, reject) => {
    handler.resolve = resolve
    handler.reject = reject
  })

  // promise.abort = (reason) => {}

  promise.resolve = (val: T) => {
    handler.resolve(val)
    return promise
  }

  promise.reject = (err?: Error) => {
    handler.reject(err)
    return promise
  }

  return promise
}
