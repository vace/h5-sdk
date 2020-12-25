import App from "../factory/App";
import Config from '../factory/Config'

/**
 * 访问服务端的service，要求必须包含app实例
 */
export function service (serviceName: string, opt: any, method: 'get' | 'post' = 'get'): Promise<any> {
  const app = App.instance
  if (!app) {
    throw new TypeError('`App.instance` not found')
  }
  const api = Config.service(`${serviceName}?appid=${app.appid}`)
  return app[method](api, opt)
}

/**
 * 上传base64文件（项目文件）
 * @param {string} base64
 * @returns {Promise<CloudResponse>}
 */
export function upbase64 (base64: string): Promise<CloudResponse> {
  return service('cloud/upbase64', { base64 }, 'post')
}

/**
 * 同步文件到cdn（项目文件）
 * @param {string} url
 * @returns {Promise<CloudResponse>}
 */
export function syncurl (url: string): Promise<CloudResponse> {
  return service('cloud/syncurl', { url })
}

/**
 * 同步文件到cdn（临时文件）
 * @param {string} url
 * @returns {Promise<CloudResponse>}
 */
export function tempurl(url: string): Promise<CloudResponse> {
  return service('cloud/tempurl', { url })
}

/**
 * 文件是否存在（临时文件）
 * @param {string} url
 * @returns {Promise<CloudResponse>}
 */
export function hastemp(key: string): Promise<CloudResponse> {
  return service('cloud/hastemp', { key })
}


/**
 * 同步远程图片
 * @param {string} url
 * @returns {Promise<CloudResponse>}
 */
export function syncimage (url: string): Promise<CloudResponse>  {
  return service('cloud/syncimage', { url })
}

/**
 * 获取文件信息
 * @param {string} key 应用文件存储的key，注意去除前缀
 * @returns {Promise<CloudResponse>}
 */
export function headfile (key: string): Promise<CloudResponse>  {
  return service('cloud/headfile', { key })
}

/**
 * 代理转发请求，解决各种跨域问题
 * @param {ProxyOption} option
 * @returns {Promise<any>}
 */
export function proxy (option: ProxyOption): Promise<any> {
  return service('cloud/proxy', option, 'post')
}

/**
 * 将微信的amr格式转换为Mp3格式
 * @param input 资源key（CloudResponse.key）
 * @param kbs 码率
 * @returns {Promise<CloudResponse>}
 */
export function amr2mp3 (input: string, kbs?: number): Promise<CloudResponse> {
  return service('cloud/amr2mp3', {input, kbs}, 'get')  
}

export type CloudResponse = {
  /** 文件名称 */
  name: string
  /** 文件路径 */
  url: string
  /** 代理服务状态 */
  status: number
  /** 代理服务器消息 */
  statusMessage: string
  /** 图片mime类型 */
  mime?: string
}

interface ProxyOption extends Request {
  url: string
  type: string
}
