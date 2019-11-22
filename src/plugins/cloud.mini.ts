/**
 * 小程序端云能力
 */

import App from "../factory/App";
import Http from "../factory/Http";

import { getServiceUri } from "../config";
import { commonResponseReslove } from "../utils/common";

declare var wx:any;

/**
 * 上传一个文件（本地文件）
 * @param {string} path 路径
 * @param {*} [data={}] 数据
 * @returns {Promise<CloudResponse>}
 */
export function upfile (path: string, data: any = {}) {
  const appid = App.hasInstance ? App.instance.appid : ''
  const api = getServiceUri(`cloud/upfile?appid=${appid}`)
  let task: any
  const promise: any = new Promise((resolve, reject) => {
    task = wx.uploadFile({
      url: api,
      filePath: path,
      name: 'file',
      formData: data,
      success({ statusCode, data }: any) {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data)
        } else {
          reject(new Error(`文件上传失败：code[${statusCode}]`))
        }
      },
      fail (err: any) {
        reject(err)
      }
    })
  })
  promise.abort = task.abort
  return promise.then(commonResponseReslove)
}

/**
 * 访问服务端的service
 * @param {string} serviceName
 * @param {*} opt
 * @param {('get' | 'post')} [method='get']
 */
export function service(serviceName: string, opt: any, method: 'get' | 'post' = 'get'): Promise<any> {
  const appid = App.hasInstance ? App.instance.appid : ''
  const api = getServiceUri(`${serviceName}?appid=${appid}`)
  return Http.instance[method](api, opt).then(commonResponseReslove)
}

/**
 * 代理转发请求，解决各种跨域问题
 * @param {ProxyOption} option
 * @returns {Promise<any>}
 */
export function proxy(option: ProxyOption): Promise<any> {
  return service('cloud/proxy', option, 'post')
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

