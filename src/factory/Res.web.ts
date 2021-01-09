import Res, { IResItem, ResTask } from './Res'
import { assign, each, isDef, isFunction } from '../functions/common'
import { jsonp } from '../functions/utils.web'

const WebFetch = ['arrayBuffer', 'blob', 'headers', 'json', 'text', 'formData']
WebFetch.forEach(fc => Res.registerLoader(fc, res => fetch(res.url, res.options).then(resp => isFunction(resp[fc]) ? resp[fc]() : resp[fc])))

// utils jsonp
Res.registerLoader('jsonp', res => jsonp(res.url, res.options))

const enum WebResAttr { LOADER, TAG, ATTR, EVENT, DEF, INSERTED }

const DEF_VAL = null
const WebRES: any[] = [
  ['css', 'link', 'href', DEF_VAL, { rel: 'stylesheet' }, true ],
  ['js', 'script', DEF_VAL, DEF_VAL, { async: 'true' }, true ],
  ['img', 'img', DEF_VAL, DEF_VAL, {}],
  ['crossimg', 'img', DEF_VAL, DEF_VAL, { crossOrigin: 'anonymous' }],
  ['audio', 'audio', DEF_VAL, 'onloadedmetadata', { preload: 'metadata' }],
  ['video', 'video', DEF_VAL, 'onloadedmetadata', { preload: 'metadata' }],
]

WebRES.forEach(wres => Res.registerLoader(wres[WebResAttr.LOADER], task => new Promise((resolve, reject) => {
  const doc = document
  const element = doc.createElement(wres[WebResAttr.TAG])
  const options = assign({ [wres[WebResAttr.ATTR] || 'src']: task.url }, wres[WebResAttr.DEF], task.options)
  const onload = wres[WebResAttr.EVENT] || 'onload'
  const onerror = 'onerror'
  const unbind = () => {
    element[onload] = element[onerror] = DEF_VAL
  }
  element[onload] = () => {
    unbind()
    resolve(element)
  }
  element[onerror] = (error) => {
    unbind()
    reject(error)
  }
  each(options, (value, attr) => isDef(value) && element.setAttribute(attr, value))
  if (wres[WebResAttr.INSERTED]) {
    const inserted = doc.head || doc.documentElement || doc.body
    inserted.insertAdjacentElement('beforeend', element)
  }
  return element
})))

export default Res
