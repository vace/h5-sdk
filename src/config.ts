import { AnalysisOption } from "./plugins/analysis";

/** 加载全局设置的配置 `window._SDK` */
const GlobalSdkConfig: DefaultConfig = window['_SDK'] || {}

/** 配置文件格式 */
export type DefaultConfig = {
  /** 分析插件配置 */
  analysis?: AnalysisOption
  /** 服务目录 */
  service: string
  /** CDN根目录 */
  cdn: string
}

/** 默认配置 */
export const config: DefaultConfig = Object.assign({
  // analysis,
  service: 'http://127.0.0.1:3000',
  cdn: 'https://5.5u55.cn'
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
 * 获取cdn文件名称
 * @param filename 文件名
 */
export function getCdnRes (filename: string): string {
  return `${config.cdn}/${filename}`
}
