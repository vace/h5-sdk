import App from "../factory/App";
import Http from "../factory/Http";

import { getServiceUri } from "../config";
import { commonResponseReslove } from "../utils/shared";
import { getAppid } from "./jssdk";

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
 * @param {boolean} isTempFile 是否为临时文件
 * @returns {Promise<CloudResponse>}
 */
export function upfile(file: File, isTempFile?: boolean): Promise<CloudResponse> {
  const form = new FormData()
  form.append('file', file, file.name)
  return service('cloud/' + (isTempFile ? 'uptemp': 'upfile'), form, 'post')
}

/**
 * 上传临时文件
 * @param {File} file
 * @returns {Promise<CloudResponse>}
 */
export function uptemp (file: File): Promise<CloudResponse> {
  return upfile(file, true)
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
  return service('cloud/wxmedia', { jsappid: getAppid(), media_id })
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
