import { createURL, isAbsolute } from "../functions/common"

const host = (api: string) => `https://${api}.ahmq.net`

const API_BASE = host('api')

type CommonQuery = string | number | Record<string, any>

export default class Config {
  /** 是否为调试模式 */
  static isDev = process.env.NODE_ENV === 'development'

  /** CDN文件根路径 */
  static CDN_ROOT = host('h5')

  /** api接口地址 */
  static API_HTTP = API_BASE

  /** auth api接口地址 */
  static API_AUTH = API_BASE

  /** app api接口地址 */
  static API_APP = API_BASE

  /** service 相关服务 */
  static API_SERVICE = host('h5-service')

  /** 普通API接口服务 */
  public static api (service: string, query?: CommonQuery) {
    return createURL(this.API_APP + '/' + service, query)
  }

  /** 获取service地址 */
  public static service (service: string, query?: CommonQuery): string {
    return createURL(this.API_SERVICE + '/' + service, query)
  }

  /** 获取cdn文件 */
  public static cdn (filename: string) {
    return Config.CDN_ROOT + (isAbsolute(filename) ? '' : '/') + filename
  }
}
