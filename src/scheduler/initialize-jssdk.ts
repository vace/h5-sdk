/**
 * 支持 解析opengraph 标签属性
 * og:title 标题。
 * og:type 类型。类型请使用协议官方网站上Object types定义的类型。
 * og:image 表示页面信息的一张缩略图地址。
 * og:url 代表页面的规范url。
 * og:description 关于页面信息的简短描述。
 * og:site_name 页面所在的网站名称。
 */

import { getElementAttrs } from "../utils/shared";
import { config, share, defaultJsApiList } from "../plugins/jssdk";
import $ from "../venders/zepto";

/**
 * 自动处理jssdk签名
 * @ignore
 */
export default function initializeJssdk () {
  const element: ZeptoCollection = $('meta[name="sdk:jssdk"]')
  if (!element.length) {
    return
  }
  const props = ['appid', 'url', 'api', '!debug']
  const options: any = getElementAttrs(element, props)
  if (options.api) {
    const apiList = options.api.split(',')
    options.jsApiList = apiList.concat(defaultJsApiList)
  }
  config(options)

  // 对于未设置的属性，尝试同步opengrah的设置
  const hasOpenGraph = (opt: any, prop1: string, prop2: string) => {
    // 已经设置则不同步opengrah
    if (opt[prop1]) return
    var el = document.querySelector(`meta[property="og:${prop2}"]`)
    if (el) {
      opt[prop1] = el.getAttribute('content')
    }
  }
  const $shares = $('meta[name="sdk:share"]')
  // banner为小程序所用的分享图标
  // config 为附带参数（一般用于设置小程序webview，格式为url parse）
  const propsShare = ['platform', 'title', 'desc', 'link', 'img', 'imgUrl', 'banner', 'config']
  
  $shares.each((index, element) => {
    const options = getElementAttrs($(element), propsShare)
    hasOpenGraph(options, 'title', 'title')
    hasOpenGraph(options, 'desc', 'description')
    hasOpenGraph(options, 'img', 'image')
    hasOpenGraph(options, 'link', 'url')
    share(options)
  })
}
