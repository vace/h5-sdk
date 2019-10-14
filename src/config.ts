import { assign } from 'es6-object-assign'
import { AnalysisOption } from "./plugins/analysis";
import { isHttp, isBase64 } from './functions/is';

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

/** 默认配置 */
export const config: DefaultConfig = assign({
  /** 接口服务 */
  api: 'https://api.ahmq.net',
  // 域名服务名称
  service: 'https://h5-service.ahmq.net',
  // CDN 的名称
  cdn: 'https://h5.ahmq.net'
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


/**
 * 获取cdn文件名称
 * @param filename 文件名
 */
export function getCdnRes (filename: string): string {
  if (!filename) {
    return filename
  }
  // 目录分隔符处理
  return `${config.cdn}${filename.charAt(0) === '/' ? '' : '/'}${filename}`
}

/**
 * 使用process处理oss资源
 * @export
 * @param {string} filename
 * @param {(string | object)} process
 */
export function getOssRes (filename: string, process: string | object) {
  if (!filename || isHttp(filename) || isBase64(filename)) {
    return filename
  }
  const res = getCdnRes(filename)
  if (!process) {
    return res
  }
  return res + '?x-oss-process=' + getImageProcess(process)
}

/**
 * @example
 * {resize: {w: 200, h: 100}} // image/resize,w_200,h_100
 */
function getImageProcess(command: any): string {
  if (!command || typeof command === 'string') {
    return command
  }
  const keys = Object.keys
  const process = keys(command).map(cmd => {
    const item = command[cmd]
    let value
    if (typeof item === 'object') {
      value = keys(item).map(key => `${key}_${item[key]}`).join(',')
    } else {
      value = item
    }
    return `${cmd},` + value
  }).join('/')
  return 'image/' + process
}
