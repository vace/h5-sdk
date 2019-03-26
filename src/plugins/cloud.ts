import App from "../factory/App";
import Http from "../factory/Http";

import { getServiceUri } from "../config";
import { commonResponseReslove } from "../utils/shared";

/**
 * 访问服务端的service
 * @param {string} serviceName
 * @param {*} opt
 * @param {('get' | 'post')} [method='get']
 */
export function service (serviceName: string, opt: any, method: 'get' | 'post' = 'get'): Promise<any> {
  const api = getServiceUri(`${serviceName}?appid=${App.getInstance().appid}`)
  return Http.instance[method](api, opt).then(commonResponseReslove)
}

/**q
 * 上传base64文件
 * @param {string} base64
 * @returns {Promise<CloudResponse>}
 */
export function upbase64 (base64: string): Promise<CloudResponse> {
  return service('cloud/upbase64', { base64 }, 'post')
}

/**
 * 上传一个文件
 * @param {File} file
 * @returns {Promise<CloudResponse>}
 */
export function upfile(file: File): Promise<CloudResponse> {
  const form = new FormData()
  form.append('file', file, file.name)
  return service('cloud/upfile', form, 'post')
}

/**
 * 同步文件到cdn
 * @param {string} url
 * @returns {Promise<CloudResponse>}
 */
export function syncurl (url: string): Promise<CloudResponse> {
  return service('cloud/syncurl', { url })
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
 * 同步微信资源文件
 * @param {string} media_id
 * @returns {Promise<CloudResponse>}
 */
export function wxmedia (media_id: string): Promise<CloudResponse>  {
  return service('cloud/wxmedia', { jsappid: App.getInstance().jsappid, media_id })
}

/**
 * 同步微信资源文件
 * @param {string} key 应用文件存储的key，注意去除前缀
 * @returns {Promise<CloudResponse>}
 */
export function headfile (key: string): Promise<CloudResponse>  {
  return service('cloud/headfile', { key })
}

/**
 * 代理转发请求，解决跨域问题
 * @param {ProxyOption} option
 * @returns {Promise<any>}
 */
export function proxy (option: ProxyOption): Promise<any> {
  return service('cloud/proxy', option, 'post')
}

export function amr2mp3 (input: string, kbs?: number) {
  return service('cloud/amr2mp3', {input, kbs}, 'get')  
}

type CloudResponse = {
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
