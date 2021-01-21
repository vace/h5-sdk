/** 导出类 */
import App                     from './factory/App';
import AuthUser                from './factory/AuthUser';
import Auth                    from './factory/Auth.mini';
import Config                  from './factory/Config';
import Emitter                 from './factory/Emitter';
import Http                    from './factory/Http.mini';
import Res                     from './factory/Res.mini';

export { App, Auth, AuthUser, Config, Emitter, Http, Res }

/* 导出辅助函数类 */
export *                       from './venders/http.mini'
export *                       from './venders/AbortController'
export *                       from './functions/common'
export *                       from './functions/utils.mini'

/** 导入插件模块类 */
export { default as hotcache } from './plugins/hotcache'
export { default as store }    from './plugins/store.mini'
export * as analysis           from './plugins/analysis.mini'
import * as cdn                from './plugins/cdn'
import * as cloud              from './plugins/cloud'
import * as safety             from './plugins/safety.mini'
import * as tool               from './plugins/tool'
import * as ui                 from './plugins/ui.mini'

export { cdn, cloud, safety, tool, ui }

/** 导出动态加载 */
const define = (key: string, get: any) => Object.defineProperty(exports, key, { get })
define('app',                  () => App.instance)
define('auth',                 () => Auth.instance)
define('user',                 () => Auth.instance && Auth.instance.user)
define('http',                 () => Http.instance)
define('emitter',              () => Emitter.instance)
define('res',                  () => Res.instance)
