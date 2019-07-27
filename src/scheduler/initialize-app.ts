import App from "../factory/App";
import { getElementAttrs } from "../utils/shared";
import * as analysis from "../plugins/analysis";
/**
 * 自动获取应用参数并启动
 * @ignore
 */
export default function initializeApp () {
  const element: ZeptoCollection = $('meta[name="sdk:app"]')
  if (!element.length) {
    return
  }
  const props = ['appid', '!analysisoff']
  const options: any = getElementAttrs(element, props)
  // 开始日志模块的工作
  if (!options.analysisoff) {
    analysis.start()
  }
  return App.createInstance(options)
}
