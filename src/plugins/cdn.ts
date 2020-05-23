import config from '../config'
import { isHttp, isBase64 } from '../functions/is'
import Http from '../factory/Http'
/**
 * 获取cdn资源
 * @param filename 文件名
 * @param process 处理函数
 */
export function res (filename: string, process?: string | object) {
  if (!filename || isHttp(filename) || isBase64(filename)) {
    return filename
  }
  const url = `${config.cdn}${filename.charAt(0) === '/' ? '' : '/'}${filename}`
  if (!process) {
    return url
  }
  // 目录分隔符处理
  return url + '?x-oss-process=' + handleImageProcess(process)
}

/**
 * 获取 lib 仓库文件
 * @param libname lib 仓库，如 vue/2.6.10/vue.min.js
 */
export function lib (libname: string) {
  return res(`/_lib/` + libname)
}

/**
 * 如果原图包含EXIF信息，添加该参数会获取EXIF信息。如果原图不包含EXIF信息，则只返回基本信息
 * @param filename 
 */
export function info (filename: string) {
  const url = res(filename, 'image/info')
  return Http.instance.get(url)
}

/**
 * 获取图片的平均色调。
 * @param filename 文件名
 */
export function hue (filename: string) {
  const url = res(filename, 'image/average-hue')
  return Http.instance.get(url)
}

/**
 * 视频截帧（默认截图第一张）
 * @param filename 文件名
 * @param w 宽度
 * @param h 高度
 * @param format 格式化jpg|png
 */
export function snapshot (filename: string, w: number = 0, h: number = 0, format: string = 'jpg') {
  return res(filename, `video/snapshot,t_0,w_${w},h_${h},f_${format}`)
}

/**
 * 智能媒体管理
 * @param filename 文件名
 * @param service 管理接口
 */
export function imm (filename: string, service: string) {
  const url = res(filename, `imm/${service}`)
  return Http.instance.get(url)
}

/**
 * @example
 * {resize: {w: 200, h: 100}} // image/resize,w_200,h_100
 */
function handleImageProcess(command: any): string {
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

