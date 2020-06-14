import { location } from "../utils/global";
import { service } from "./cloud";
import { getAppid } from "../plugins/jssdk";

/**
 * 微信能力
 */

/**
 * 获取微信账号二维码
 * @param {string} username
 */
export function getQrcode (username: string): string {
  return `https://open.weixin.qq.com/qr/code?username=${username}`
}
