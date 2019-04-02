import _store from 'store/dist/store.modern'

/** 优化生成d.ts时的智能提示 */
export const store = _store as StoreAPI

interface StoreAPI {
  readonly version: string;
  readonly enabled: boolean;
  get(key: string, optionalDefaultValue?: any): any;
  set(key: string, value: any): any;
  remove(key: string): void;
  each(callback: (val: any, namespacedKey: string) => void): void;
  clearAll(): void;
  hasNamespace(namespace: string): boolean;
  createStore(plugins?: Function[], namespace?: string): StoreAPI;
  addPlugin(plugin: Function): void;
  namespace(namespace: string): StoreAPI;
}
