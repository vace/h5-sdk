/**
 * 小程序端云能力
 */

export * from './cloud'

import App from "../factory/App";
import { CloudResponse } from './cloud'
import { getServiceUri } from "../config";
import { commonResponseReslove } from "../utils/common";

declare var wx:any;

/**
 * 上传一个文件（本地文件）
 * @param {string} path 路径
 * @param {boolean} [isTempFile] 是否上传临时文件
 * @returns {Promise<CloudResponse>}
 */
export function upfile (path: string, isTempFile?: boolean) {
  const appid = App.hasInstance ? App.instance.appid : ''
  const api = getServiceUri(`cloud/${isTempFile ? 'uptemp' : 'upfile'}?appid=${appid}`)
  let task: any
  const promise: any = new Promise((resolve, reject) => {
    task = wx.uploadFile({
      url: api,
      filePath: path,
      name: 'file',
      formData: {},
      success({ statusCode, data }: any) {
        if (statusCode >= 200 && statusCode < 300) {
          resolve(typeof data === 'string' ? JSON.parse(data) : data)
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
 * 上传文件（临时文件）
 * @param {File} file
 * @returns {Promise<CloudResponse>}
 */
export function uptemp(path: string): Promise<CloudResponse> {
  return upfile(path, true)
}
