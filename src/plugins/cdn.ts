import { isHttp, isBase64, keys, makeMap } from '../functions/common'
import Http from '../factory/Http'
import Config from '../factory/Config'

/**
 * 获取cdn资源
 * @param filename 文件名
 * @param process 处理函数
 */
export function res (filename: string, process?: string) {
  return Config.cdn(filename, process)
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
  return Http.json(url)
}

/**
 * 获取图片的平均色调。
 * @param filename 文件名
 */
export function hue (filename: string) {
  const url = res(filename, 'image/average-hue')
  return Http.json(url)
}

/**
 * 视频截帧（默认截图第一张）
 * @param filename 文件名
 * @param w 宽度
 * @param h 高度
 * @param format 格式化jpg|png
 */
export function snapshot (filename: string, w: number = 0, h: number = 0, format: string = 'jpg') {
  return res(filename, `video/snapshot,t_0,w_${w},h_${h},f_${format},m_fast`)
}

/**
 * 智能媒体管理
 * @param filename 文件名
 * @param service 管理接口
 */
export function imm (filename: string, service: string) {
  const url = res(filename, `imm/${service}`)
  return Http.json(url)
}

export const styles = makeMap('w750 jpg webp w300 w600 w200 w100 w400 w500 100x100 800x600 640x480 400x200 400x300 500x400 500x500 600x600 400x400 300x300 200x200'.split(' '))
/**
 * 图片处理规则 @see https://help.aliyun.com/document_detail/48884.html
 */
export function style (filename: string, style: string) {
  return res(filename, `style/${style}`)
}
