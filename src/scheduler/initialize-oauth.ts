import Oauth from "../factory/Oauth";
import { getElementAttrs } from "../utils/shared";
/**
 * 自动获取应用参数并启动
 * @ignore
 */
export default function initializeApp() {
  const element: ZeptoCollection = $('meta[name="sdk:oauth"]')
  if (!element.length) {
    return
  }
  const props = ['platform', 'type', 'appid', 'scope', 'env', 'callback']
  const options: any = getElementAttrs(element, props)
  return Oauth.getInstance().init(options)
}
