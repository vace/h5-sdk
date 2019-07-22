export interface IStore {
  read(key: string): any,
  write(key: string, val: any): any,
  remove(key: string): any,
  clearAll(): any
  keys (): string[]
}
