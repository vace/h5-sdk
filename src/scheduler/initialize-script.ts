import { getElementAttrs } from "../utils/shared";
import { dirname } from "../functions/path";

/**
 * 自动加载script
 * @ignore
 */
export default function initializeScript () {
  let doc = document
  let js = doc.scripts
  // 当前的script
  const script = js[js.length - 1]
  const { debug, autocss } = getElementAttrs(script, ['!debug', '!autocss'])
  const path = dirname(script.src) + '/'
  // debug 工具
  if (debug) {
    var injectScript = doc.createElement('script')
    injectScript.src = '//h5.ahmq.net/_lib/eruda/1.5.7/eruda.min.js'
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
