import { dirname, isString } from "../functions/common"
import { getElementAttrs } from '../plugins/tool.web'
import { lib } from '../plugins/cdn'
import Res from '../factory/Res.web'
import Auth from '../factory/Auth'
import App from '../factory/App'
import UiMusic from '../factory/UiMusic.web'
import jssdk from '../plugins/jssdk.web'
import { document } from '../functions/utils.web'

initializeScript()
initializeAuth()
initializeApp()
initializeJssdk()
initializeMusic()

/** 自动加载script */
function initializeScript() {
  let doc = document
  let js = doc.scripts
  // 当前的script
  const script = js[js.length - 1]
  const { debug, autocss } = getElementAttrs(script, ['!debug', '!autocss'])
  const path = dirname(script.src) + '/'
  const loader = Res.instance
  // 自动加载css
  autocss && loader.add(path + 'sdk.css')
  // debug 工具
  if (debug || /showdebug/i.test(location.search)) {
    loader.add(lib('eruda/2.4.1/eruda.min.js')).then(() => {
      (window['eruda']).init()
      // TODO debug tools
      // eruda.get('info').add('AppInfo', 'appid:xxxx')
    })
  }
}

function initializeAuth() {
  const props = ['platform', 'type', 'appid', 'scope', 'env', '!offlogin']
  const config = _queryElementAttr('meta[name="sdk:auth"]', props)
  if (config) {
    const auth = new Auth(config)
    // 是否关闭自动登陆
    if (!config.offlogin) {
      auth.login()
    }
  }
}

function initializeApp () {
  const props = ['appid', '!analysisoff']
  const config = _queryElementAttr('meta[name="sdk:app"]', props)
  config && new App(config)
}

function initializeJssdk () {
  const props = ['appid', 'url', 'api', '!debug']
  const config = _queryElementAttr('meta[name="sdk:jssdk"]', props)
  if (!config) return
  if (config.api) {
    config.jsApiList = config.api.split(',')
  }
  jssdk.config(config)

  // 只设置全局分享，如果需要定制，需要自行调用接口
  // banner为小程序所用的分享图标, config 为附带参数（一般用于设置小程序webview，格式为url parse）
  const attrs = ['title', 'desc', 'link', 'img', 'imgurl', 'banner', 'config', 'type', 'dataurl']
  const share = _queryElementAttr('meta[name="sdk:share"]', attrs)
  if (!share) return

  const graphs = [
    { prop: 'title', meta: 'title' },
    { prop: 'desc', meta: 'description' },
    { prop: 'img', meta: 'image' },
    { prop: 'link', meta: 'url' },
  ]
  graphs.forEach(graph => {
    if (!share[graph.prop]) {
      const attr = _queryElementAttr(`meta[property="og:${graph.meta}"]`, 'content')
      if (attr) {
        share[graph.prop] = attr
      }
    }
  })
  jssdk.share(share)
}

function initializeMusic () {
  const props = [
    'target', 'src', 'className', 'theme', 'position', '!autoplay', '!background', '!loop', '!muted', '+volume', 'preload', '?size', '?offsetX', '?offsetY'
  ]
  const options = _queryElementAttr('meta[name="sdk:music"]', props)
  options && new UiMusic(options)
}


function _queryElementAttr (selecotr: string, attrs: string | string[]): null | any {
  const element = document.querySelector(selecotr)
  if (!element) return
  if (isString(attrs)) return element.getAttribute(attrs)
  return getElementAttrs(element, attrs)
}
