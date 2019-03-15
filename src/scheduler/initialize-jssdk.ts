import { getElementAttrs } from "../utils/shared";
import { config, share, defaultJsApiList } from "../plugins/jssdk";
import $ from "../venders/zepto";

export default function initializeJssdk () {
  const element: ZeptoCollection = $('meta[name="sdk:jssdk"]')
  if (!element.length) {
    return
  }
  const props = ['url', 'api', '!debug']
  const options: any = getElementAttrs(element, props)
  if (options.api) {
    const apiList = options.api.split(',')
    options.jsApiList = apiList.concat(defaultJsApiList)
  }
  config(options)
  const $shares = $('meta[name="sdk:share"]')
  const propsShare = ['type', 'title', 'desc', 'link', 'img', 'imgUrl']
  $shares.each((index, element) => {
    const options = getElementAttrs($(element), propsShare)
    share(options)
  })
}
