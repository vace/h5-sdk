import { AnalysisOption } from "./plugins/analysis";

// 加载全局设置的配置

const global: any = window['_SDK'] || {}

export type DefaultConfig = {
  /** 分析插件配置 */
  analysis?: AnalysisOption
  /** 服务目录 */
  service: string
  /** CDN根目录 */
  cdn: string
}

const config: DefaultConfig = {
  // analysis,
  service: 'http://127.0.0.1:3000',
  cdn: 'https://5.5u55.cn'
}

// 合并配置文件后导出
export default Object.assign(config, global) as DefaultConfig

/**
 * 获取service的uri
 * @param {string} name
 * @returns {string}
 */
export function getServiceUri (name: string): string {
  return `${config.service}/${name}`
}

/**
 * 获取cdn文件
 * @param filename 文件名
 * @returns {string}
 */
export function getCdnRes (filename: string): string {
  return `${config.cdn}/${filename}`
}
