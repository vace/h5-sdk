import { App } from "../factory/App";
import { getCurrentHref } from "../utils/shared";
import { randomstr, stringify, parse, each } from "../functions/index";
import { location } from "../utils/global";
import { service } from "./cloud";

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

type WechatSubscribeMsg = {
  openid: string
  template_id: string
  action: 'confirm' | 'cancel'
  scene: number
  reserved: string
}

/** 微信一次性订阅消息 */
export function subscribeMsg(template_id: string, scene: number = 1): WechatSubscribeMsg | undefined {
  if (!template_id) {
    throw new Error('template_id cannot be empty');
  }
  const app = App.getInstance()
  const [host, queryStr] = getCurrentHref().split('?')
  const _query: any = parse(queryStr)
  const newquery = {
    action: 'get_confirm',
    appid: app.wxappid,
    scene,
    template_id,
    redirect_url: getCurrentHref(),
    reserved: randomstr(16)
  }
  // 授权返回
  if (_query.template_id === template_id) {
    return _query
  } else {
    // 消除参数歧义
    each(newquery, (val: any, key: string) => delete _query[key])
    newquery.redirect_url = `${host}?${stringify(_query)}`
    location.replace(`https://mp.weixin.qq.com/mp/subscribemsg?${stringify(newquery)}#wechat_redirect`)
  }
}

/** 获取短连接 */
export function shorturl (url: string): Promise<string> {
  const app = App.getInstance()
  return service('wechat/shorturl', {
    wxappid: app.wxappid,
    url: url || location.href
  })
}
