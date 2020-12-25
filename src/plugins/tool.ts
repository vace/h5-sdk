import Config from '../factory/Config'

/** 后端服务生成生成二维码 */
export function qrcode (text: string, size = 400) {
  return Config.api('/qrcode/build', { text, size })
}
