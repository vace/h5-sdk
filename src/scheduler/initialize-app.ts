import { getElementAttrs } from "../utils/shared";
import { App } from "../factory/App";

export default function initializeApp () {
  const element: ZeptoCollection = $('meta[name="sdk:app"]')
  if (!element.length) {
    return
  }
  const props = ['appid', 'scope', 'wxappid', 'jsappid']
  const options: any = getElementAttrs(element, props)
  App.getInstance().config(options).run()
}
