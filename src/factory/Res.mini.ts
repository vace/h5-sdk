import Res from './Res'
import Http from './Http'
import { isFunction } from '../functions/common'
import { getOffscreenCanvas, WxError } from '../functions/utils.mini'

declare var wx: any

const WebFetch = ['arrayBuffer', 'headers', 'json', 'text']
WebFetch.forEach(fc => Res.registerLoader(fc, res => Http.request(res.url, res.options).then(resp => isFunction(resp[fc]) ? resp[fc]() : resp[fc])))

Res.registerLoader('img', (task) => new Promise((resolve, reject) => {
  const img: HTMLImageElement = getOffscreenCanvas().createImage()
  img.onload = () => resolve(img)
  img.onerror = (err) => reject(err)
  img.src = task.url
  return img
}))

// 下载文件
Res.registerLoader('download', task => new Promise((resolve, reject) => {
  const download = wx.downloadFile({
    url: task.url,
    ...task.options,
    success: (res: any) => resolve(res),
    fail: (err: Error) => reject(new WxError(err))
  })
  task.task = download
  return download
}))

export default Res
