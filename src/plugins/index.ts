import { Http } from '../factory/Http'
import { App } from '../factory/App';

import * as _jssdk from './jssdk'
import * as _ui from './ui'
import * as _safety from './safety'
import * as _tool from './tool'
import * as _cloud from './cloud'
import * as _analysis from './analysis'
import * as _wechat from './wechat'

export { store } from './store';
export const http = Http.instance
export const jssdk = _jssdk
export const cloud = _cloud
export const analysis = _analysis
export const ui = _ui
export const safety = _safety
export const tool = _tool
export const app = App.getInstance()
export const wechat = _wechat
