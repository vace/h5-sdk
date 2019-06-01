/**
 * 用法实例
 * ```javascript
 * var task = new Tasker()
 * 
 * task.then(() => console.log('task ok'))
 * 
 * task.resolve()
 * 
 * ```
 */


export default class Tasker {
  /** 是否已经执行 */
  public isWorked: boolean = false
  /** 已执行 */
  public isDone: boolean = false
  /** 任务实体 */
  public task: Promise<any>

  private _nativeResolve!: Function
  private _nativeReject!: Function

  public constructor () {
    this.task = new Promise((resolve, reject) => {
      this._nativeReject = reject
      this._nativeResolve = resolve
    })
  }

  public working () {
    this.isWorked = true
  }

  public resolve (val: any) {
    this.isDone = true
    this._nativeResolve(val)
    return this.task
  }
  public reject (err: any) {
    this.isDone = true
    this._nativeReject(err)
    return this.task
  }
  public then (onfulfilled: any, onrejected: any) {
    return this.task.then(onfulfilled, onrejected)
  }
}