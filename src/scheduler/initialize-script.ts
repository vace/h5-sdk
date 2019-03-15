import { getElementAttrs } from "../utils/shared";
import { dirname } from "../functions/path";

export default function () {
  let doc = document
  let js = doc.scripts
  // 当前的script
  const script = js[js.length - 1]
  const { debug, autocss } = getElementAttrs(script, ['!debug', '!autocss'])
  const path = dirname(script.src) + '/'
  // debug 工具
  if (debug) {
    var injectScript = doc.createElement('script')
    injectScript.src = '//5.5u55.cn/_lib/eruda/1.5.4/eruda.min.js'
    doc.body.appendChild(injectScript)
    injectScript.onload = () => (window['eruda']).init()
  }

  // 自动加载css
  if (autocss) {
    var link = doc.createElement('link')
    link.href = path + 'sdk.css'
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.id = '_sdk-style'
    doc.head.appendChild(link)
  }
}
