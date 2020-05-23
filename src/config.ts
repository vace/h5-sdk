import { assign } from 'es6-object-assign'
import { AnalysisOption } from "./plugins/analysis";

/** 加载全局设置的配置 `window._SDK` */
const GlobalSdkConfig: DefaultConfig = (typeof window !== 'undefined' && window['_SDK']) || {}

/** 是否为调试模式 */
// @ts-ignore
export let isDev = process.env.NODE_ENV === 'development'

/** 配置文件格式 */
export type DefaultConfig = {
  /** api 服务 */
  api: string
  /** 分析插件配置 */
  analysis?: AnalysisOption
  /** 服务目录 */
  service: string
  /** CDN根目录 */
  cdn: string
}
const host = (api: string) => `https://${api}.ahmq.net`

/** 默认配置 */
export const config: DefaultConfig = assign({
  /** 接口服务 */
  api: host('api'),
  // 域名服务名称
  service: host('h5-service'),
  // CDN 的名称
  cdn: host('h5'),
} as DefaultConfig, GlobalSdkConfig)

/** 默认配置 */
export default config

/**
 * 获取service的uri
 * @param {string} name
 */
export function getServiceUri (name: string): string {
  return `${config.service}/${name}`
}

/**
 * 获取service的uri
 * @param {string} name
 */
export function getApiUri(name: string): string {
  return `${config.api}/${name}`
}
