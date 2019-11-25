import { service, CloudResponse } from './cloud'
import { getAppid } from "./jssdk";

export * from './cloud'

/**
 * 同步微信资源文件
 * @param {string} media_id
 * @returns {Promise<CloudResponse>}
 */
export function wxmedia(media_id: string): Promise<CloudResponse> {
  return service('cloud/wxmedia', { jsappid: getAppid(), media_id })
}

/**
 * 上传一个文件（项目文件）
 * @param {File} file
 * @param {boolean} isTempFile 是否为临时文件
 * @returns {Promise<CloudResponse>}
 */
export function upfile(file: File, isTempFile?: boolean): Promise<CloudResponse> {

  const form = new FormData()
  form.append('file', file, file.name)
  return service('cloud/' + (isTempFile ? 'uptemp' : 'upfile'), form, 'post')
}

/**
 * 上传文件（临时文件）
 * @param {File} file
 * @returns {Promise<CloudResponse>}
 */
export function uptemp(file: File): Promise<CloudResponse> {
  return upfile(file, true)
}
