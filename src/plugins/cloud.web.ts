import { service, CloudResponse } from './cloud'
import { config } from "./jssdk.web";

export * from './cloud'

/** 同步微信资源文件 */
export function wxmedia(media_id: string): Promise<CloudResponse> {
  return service('cloud/wxmedia', { jsappid: config.appid, media_id })
}

/** 上传一个文件（项目文件） */
export function upfile(file: File, isTempFile?: boolean): Promise<CloudResponse> {
  const form = new FormData()
  form.append('file', file, file.name)
  return service('cloud/' + (isTempFile ? 'uptemp' : 'upfile'), form, 'post')
}

/** 上传文件（临时文件） */
export function uptemp(file: File): Promise<CloudResponse> {
  return upfile(file, true)
}
