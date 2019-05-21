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

// type WechatSubscribeMsg = {
//   openid: string
//   template_id: string
//   action: 'confirm' | 'cancel'
//   scene: number
//   reserved: string
// }

/** 微信一次性订阅消息，废弃，不再由前端进行维护 */
// export function subscribeMsg(appid: string, template_id: string, scene: number = 1): WechatSubscribeMsg | undefined {
//   if (!template_id) {
//     throw new Error('template_id cannot be empty');
//   }
//   const [host, queryStr] = getCurrentHref().split('?')
//   const _query: any = parse(queryStr)
//   const newquery = {
//     action: 'get_confirm',
//     appid,
//     scene,
//     template_id,
//     redirect_url: getCurrentHref(),
//     reserved: randomstr(16)
//   }
//   // 授权返回
//   if (_query.template_id === template_id) {
//     return _query
//   } else {
//     // 消除参数歧义
//     each(newquery, (val: any, key: string) => delete _query[key])
//     newquery.redirect_url = `${host}?${stringify(_query)}`
//     location.replace(`https://mp.weixin.qq.com/mp/subscribemsg?${stringify(newquery)}#wechat_redirect`)
//   }
// }

/** 获取短连接，appid不提供则读取jsappid */
export function shorturl (url: string, appid?: string): Promise<string> {
  return service('wechat/shorturl', {
    appid: appid || getAppid(),
    url: url || location.href
  })
}
