/** 版本号 */
export const version = '__VERSION__'

const define = (key: string, get: any) => Object.defineProperty(exports, key, { get })

/** 导出类 */
import App from './factory/App';
import AuthUser from './factory/AuthUser';
import Auth from './factory/Auth.mini';
import Config from './factory/Config';
import Emitter from './factory/Emitter';
import Http from './factory/Http.mini';
import Res from './factory/Res';
import Tasker from './factory/Tasker'
import AbortController from './factory/AbortController'

export { App, Auth, AuthUser, Config, Emitter, Http, Res, Tasker, AbortController }

define('app', () => App.instance)
define('auth', () => Auth.instance)
define('user', () => Auth.instance && Auth.instance.user)
define('http', () => Http.instance)
define('emitter', () => Emitter.instance)
define('res', () => Res.instance)

export { DOMException, Headers, Request, Response } from './venders/http.mini'

/* 导出辅助函数类 */
export * from './functions/common'
export * from './functions/utils.mini'

/** 导入插件模块类 */
// import analysis from './plugins/analysis.web'
import hotcache from './plugins/hotcache'
import store from './plugins/store.mini'
import * as cdn from './plugins/cdn'
import * as cloud from './plugins/cloud'
import * as safefy from './plugins/safety'
import * as tool from './plugins/tool'

export { cdn, store, cloud, hotcache, safefy, tool }
