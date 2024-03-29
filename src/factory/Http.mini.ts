import Http, { HttpError, HttpMethod } from './Http'
import { DOMException, Headers as IHeader, Request as IRequest, Response as IResponse } from '../venders/http.mini'
import { loading, error, success } from '../plugins/ui.mini'

declare var wx: any

// 注册loading
Http.showLoading = message => loading(message)
Http.showError = message => error(message)
Http.showSuccess = message => success(message)

Http['DOMException'] = DOMException
Http.HttpHeaders = <any> IHeader
Http.HttpRequest = <any> IRequest
Http.HttpResponse = <any> IResponse
Http.request = (url: string, request: IRequest) => {
  return new Promise((resolve, reject) => {
    if (request.method === HttpMethod.JSONP) {
      throw new HttpError(-1, 'not support method: JSONP', request as any)
    }
    const signal = request.signal
    if (signal && signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    //! bug fix 小程序不支持原生 Header，使用header会转换为map{}形式
    //见`node-fetch`.`Header` 以及 headers 文档
    let rheader: any = request.headers
    if (rheader instanceof IHeader) {
      rheader = rheader.raw()
    }

    const task = wx.request({
      url,
      data: request.body,
      header: rheader,
      method: request.method,
      timeout: request.timeout,
      // 不对返回值进行处理
      responseType: 'text',
      dataType: 'text',
      success: (ret: any) => {
        // todo cookies
        const { data, statusCode, header, cookies } = ret
        const response: any = new IResponse(data, {
          headers: header,
          status: statusCode,
          url: url,
          cookies: cookies,
        })
        resolve(response)
      },
      fail: (err: any) => reject(new HttpError(-1, err.errMsg)),
      complete: () => signal && signal.removeEventListener('abort', abort)
    })
    // 取消此请求
    const abort = () => task.abort()
    signal && signal.addEventListener('abort', abort)
  })
}

export default Http
