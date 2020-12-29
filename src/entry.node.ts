/**
 * NODEJS 版本sdk
 */

/** 版本号 */
export const version = '__VERSION__'

/** 导出类 */
import App              from './factory/App';
import Auth             from './factory/Auth.node';
import AuthUser         from './factory/AuthUser';
import Config           from './factory/Config';
import Emitter          from './factory/Emitter';
import Res              from './factory/Res';
import Tasker           from './factory/Tasker'
import Http             from './factory/Http.node';

export { App, Auth, AuthUser, Config, Emitter, Http, Res, Tasker }

/* 导出辅助函数类 */
export * from './functions/common'
export * from './functions/utils.node'

/** 导入插件模块类 */
export * as hotcache    from './plugins/hotcache'
export * as store       from './plugins/store.node'
import * as cdn         from './plugins/cdn'
import * as cloud       from './plugins/cloud'
import * as safefy      from './plugins/safety'
export { cdn, cloud, safefy }

/** 导出动态加载 */
const define = (key: string, get: any) => Object.defineProperty(exports, key, { get })
define('app',     () => App.instance)
define('auth',    () => Auth.instance)
define('user',    () => Auth.instance && Auth.instance.user)
define('http',    () => Http.instance)
define('emitter', () => Emitter.instance)
define('res',     () => Res.instance)