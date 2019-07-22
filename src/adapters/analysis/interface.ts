export interface IAnalysis {
  getCurrentUrl (privacy: any): string,
  getErrorStack (error: any): string,
  getUserAgent (): string,
  getCurrentParam (): Record<string, any>
  send (target: string): Promise<any>

  onShow (fn: EventListener): any
  onError (fn: EventListener): any
  onUnload (fn: EventListener): any
}
