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

/** 获取短连接，appid不提供则读取jsappid */
export function shorturl (url: string, appid?: string): Promise<string> {
  return service('wechat/shorturl', {
    appid: appid || getAppid(),
    url: url || location.href
  })
}
