import App from "../factory/App";
import { getElementAttrs } from "../utils/shared";
/**
 * 自动获取应用参数并启动
 * @ignore
 */
export default function initializeApp () {
  const element: ZeptoCollection = $('meta[name="sdk:app"]')
  if (!element.length) {
    return
  }
  const props = ['appid', 'version']
  const options: any = getElementAttrs(element, props)
  return App.getInstance().init(options)
}
