import { dirname, isString } from "../functions/common"
import { lib } from '../plugins/cdn'
import Res from '../factory/Res.web'
import Auth from '../factory/Auth'
import App from '../factory/App'
import Config from '../factory/Config'
import UiMusic from '../factory/UiMusic.web'
import { signature, share as setJssdkShare } from '../plugins/jssdk.web'
import { document, getDomAttrs } from '../functions/utils.web'

initializeScript()
initializeSdk()
initializeAuth()
initializeApp()
initializeJssdk()
initializeMusic()

/** 自动加载script */
function initializeScript() {
  let js = document.scripts
  // 当前的script
  const script = js[js.length - 1]
  const { debug, autocss } = getDomAttrs(script, ['!debug', '!autocss'])
  const path = dirname(script.src) + '/'
  const loader = Res.instance
  // 自动加载css
  autocss && loader.css(path + 'sdk.css')
  // debug 工具
  if (debug || /showdebug/i.test(location.search)) {
    // TODO debug tools
    // eruda.get('info').add('AppInfo', 'appid:xxxx')
    // @ts-ignore 
    loader.js(lib('eruda/2.4.1/eruda.min.js')).then(() => eruda.init())
  }
}

// 应用全局设置
function initializeSdk () {
  const props = ['api']
  const config = _queryHeadMetaAttr('name="sdk:auth"', props)
  if (config) {
    Config.set(config)
  }
}

// 应用授权设置
function initializeAuth() {
  const props = ['platform', 'type', 'appid', 'scope', 'env', '!offlogin']
  const config = _queryHeadMetaAttr('name="sdk:auth"', props)
  if (config) {
    const auth = new Auth(config)
    // 是否关闭自动登陆
    if (!config.offlogin) {
      auth.login()
    }
  }
}

// 应用后端设置
function initializeApp () {
  const props = ['appid', 'readyapi', '!analysisoff']
  const config = _queryHeadMetaAttr('name="sdk:app"', props)
  config && new App(config)
}

// jssdk设置
function initializeJssdk () {
  const props = ['appid', 'url', 'api', '!debug']
  const config = _queryHeadMetaAttr('name="sdk:jssdk"', props)
  if (!config) return
  if (config.api) {
    config.jsApiList = config.api.split(',')
  }
  signature(config)

  // 只设置全局分享，如果需要定制，需要自行调用接口
  // banner为小程序所用的分享图标, config 为附带参数（一般用于设置小程序webview，格式为url parse）
  const attrs = ['title', 'desc', 'link', 'img', 'imgurl', 'banner', 'config', 'type', 'dataurl']
  const share = _queryHeadMetaAttr('name="sdk:share"', attrs)
  if (!share) return

  const graphs = [
    { prop: 'title', meta: 'title' },
    { prop: 'desc', meta: 'description' },
    { prop: 'img', meta: 'image' },
    { prop: 'link', meta: 'url' },
  ]
  graphs.forEach(graph => {
    if (!share[graph.prop]) {
      const attr = _queryHeadMetaAttr(`property="og:${graph.meta}"`, 'content')
      if (attr) {
        share[graph.prop] = attr
      }
    }
  })
  setJssdkShare(share)
}

// 背景音乐
function initializeMusic () {
  const props = [
    'target', 'src', 'className', 'theme', 'position', '!autoplay', '!background', '!loop', '!muted', '+volume', 'preload', '?size', '?offsetX', '?offsetY'
  ]
  const options = _queryHeadMetaAttr('name="sdk:music"', props)
  options && new UiMusic(options)
}

function _queryHeadMetaAttr (name: string, attrs: string | string[]): null | any {
  const head = document.head
  const element = head && head.querySelector(`meta[${name}]`)
  if (!element) return
  if (isString(attrs)) return element.getAttribute(attrs)
  return getDomAttrs(element, attrs)
}
