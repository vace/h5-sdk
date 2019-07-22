import Auth from "../factory/Auth";
import { getElementAttrs } from "../utils/shared";
/**
 * 自动获取应用参数并启动
 * @ignore
 */
export default function initializeApp() {
  const element: ZeptoCollection = $('meta[name="sdk:auth"]')
  if (!element.length) {
    return
  }
  const props = ['platform', 'type', 'appid', 'scope', 'env', 'callback', 'version', '!autorun']
  const options: any = getElementAttrs(element, props)
  return Auth.createInstance(options)
}
