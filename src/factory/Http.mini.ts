import Http, { HttpError, HttpMethod } from './Http'
import { DOMException, Headers, Request, Response } from '../venders/http.mini'

declare var wx: any

Http['DOMException'] = DOMException
Http.HttpHeaders = Headers
Http.HttpRequest = Request
Http.HttpResponse = Response
Http.request = async (url: string, request: Request) => {
  if (request.method === HttpMethod.JSONP) {
    throw new HttpError(-1, 'not support method: JSONP', request as any)
  }
  return new Promise((resolve, reject) => {
    const signal = request.signal
    if (signal && signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    const task = wx.request({
      url,
      data: request.body,
      header: request.headers,
      method: request.method,
      timeout: request.timeout,
      // 不对返回值进行处理
      responseType: 'text',
      dataType: 'text',
      success: (ret: any) => {
        // todo cookies
        const { data, statusCode, header, cookies } = ret
        const response = new Response(data, {
          headers: header,
          status: statusCode,
          url: url
        })
        resolve(response)
      },
      fail: err => {
        reject(new HttpError(-1, err.errMsg))
      },
      complete: () => signal && signal.removeEventListener('abort', abort)
    })
    // 取消此请求
    const abort = () => task.abort()
    signal && signal.addEventListener('abort', abort)
  })
}

export default Http
