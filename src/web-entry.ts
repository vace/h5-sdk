import './assets/common.less'
import './assets/icon.less'
import './venders/index'

/** 版本号 */
export const version = '__VERSION__'

const define = (key: string, get: any) => Object.defineProperty(exports, key, { get })

/** 导出类 */
import App from './factory/App';
import Auth from './factory/Auth.web';
import AuthUser from './factory/AuthUser';
import Config from './factory/Config.web';
import Emitter from './factory/Emitter';
import Http from './factory/Http.web';
import Res from './factory/Res.web';
import Tasker from './factory/Tasker'
import UiBase from './factory/UiBase.web'
import UiModal from './factory/UiModal.web'
import UiMusic from './factory/UiMusic.web'
import UiSheet from './factory/UiSheet.web'
import UiToast from './factory/UiToast.web'
import UiView from './factory/UiView.web'

export { App, Auth, AuthUser, Config, Emitter, Http, Res, Tasker, UiBase, UiModal, UiMusic, UiSheet, UiToast, UiView }

define('app', () => App.instance)
define('auth', () => Auth.instance)
define('user', () => Auth.instance && Auth.instance.user)
define('http', () => Http.instance)
define('emitter', () => Emitter.instance)
define('music', () => UiMusic.instance)
define('res', () => Res.instance)

/* 导出辅助函数类 */
export * from './functions/common'
export * from './functions/web'

/** 导入插件模块类 */
import analysis from './plugins/analysis.web'
import hotcache from './plugins/hotcache'
import jssdk from './plugins/jssdk.web'
import location from './plugins/location.web'
import store from './plugins/store.web'
import * as cdn from './plugins/cdn'
import * as cloud from './plugins/cloud.web'
import * as safefy from './plugins/safety'
import * as tool from './plugins/tool.web'
import * as ui from './plugins/ui.web'

export { analysis, cdn, store, cloud, hotcache, jssdk, safefy, location, tool, ui }

// 导出getter 模块

// import './scheduler/index'
import './scheduler/task.web'
