import { isString, isObject, isHttp, isFormData } from "../functions/is";
import { stringify } from "../functions/qs";
import { isAbsolute } from "../functions/path";

// import { fetch } from "../utils/global"

export type CommonResponseData = {
  code: number
  data: any
  message: string
  msg: string // 兼容老版本API
}

interface HttpRequestBase {
  // 附带参数
  method?: 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH'
  headers?: HeadersInit
  // 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
  body?: any
  mode?: 'cors' | 'no-cors' | 'same-origin'
  cache?: RequestCache
  // `withCredentials` indicates whether or not cross-site Access-Control requests
  credentials?: RequestCredentials
  redirect?: RequestRedirect
  referrer?: ' no-referrer' | 'client'
}

export interface HttpOption extends HttpRequestBase{
  baseURL?: string
  timeout?: number
  transformRequest?: (arg: TransformRequestOption) => any
  transformResponse?: (res: Response) => any
  responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
  validateStatus?: (status: number) => boolean
}

export interface TransformRequestOption extends RequestInit {
  /** 接口请求链接 */
  url: string
}

interface HttpRequestOption extends HttpRequestBase {
  url: string
  params?: any
  data?: any
}

enum Method {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH'
}

enum ContentType {
  UrlEncode = 'application/x-www-form-urlencoded;charset=utf-8',
  JSON = 'application/json;charset=utf-8'
}

export class Http {
  public static option: HttpOption = {
    baseURL: '',
    timeout: 0,
    // headers: {
    //   'X-Requested-With': 'XMLHttpRequest'
    // },
    credentials: 'include',
    // transformRequest: ,
    // transformResponse,
    // params: {},
    // data,
    responseType: 'json',
    validateStatus (status: number) {
      return status >= 200 && status < 300
    }
  }
  public static _instance: Http
  public static get instance (): Http {
    if (!this._instance) {
      this._instance = new Http()
    }
    return this._instance
  }

  public option: HttpOption
  public constructor (_option?: HttpOption) {
    this.option = Object.assign({}, Http.option, _option)
  }
  public get (url: string, params?: any): Promise<any> {
    return this.request({url, method: Method.GET, params })
  }
  public delete (url: string, params?: any): Promise<any> {
    return this.request({ url, method: Method.DELETE, params })
  }
  public head (url: string, params?: any): Promise<any> {
    return this.request({ url, method: Method.HEAD, params })
  }
  public options (url: string, params?: any): Promise<any> {
    return this.request({ url, method: Method.OPTIONS, params })    
  }
  public post (url: string, data?: any): Promise<any> {
    return this.request({ url, method: Method.POST, data })
  }
  public put(url: string, data?: any): Promise<any> {
    return this.request({ url, method: Method.PUT, data })
  }
  public patch(url: string, data?: any): Promise<any> {
    return this.request({ url,  method: Method.PATCH, data })
  }
  public request(option: HttpRequestOption): Promise<any> {
    const config = Object.assign({}, option, this.option)
    const {
      method, mode, cache, credentials, redirect, referrer,
      baseURL, timeout, transformRequest, transformResponse, responseType, validateStatus
    } = config
    let headers = new Headers(config.headers)
    let { url, params, data, body } = config
    // get
    if (method === Method.GET || method === Method.HEAD || method === Method.DELETE || method === Method.OPTIONS) {
      body = void 0 // clear body
      if (params) { // 参数组合
        url += (url.indexOf('?') === -1 ? '?' : '&') + (isString(params) ? params : stringify(params))
      }
    } else {
      const StrContentType = 'content-type'
      body = data || body
      // 根据 content type 处理body
      let contentType = headers.get(StrContentType)
      // 上传文件
      if (isFormData(body)) {
        headers.delete(StrContentType)
      } else if (isString(body)) {
        contentType = ContentType.UrlEncode
      } else if (isObject(body)) {
        if (contentType === ContentType.UrlEncode) {
          body = stringify(body)
        } else {
          body = JSON.stringify(body)
        }
      }
      if (contentType) headers.set(StrContentType, contentType)
    }
    // 设置了根路径
    if (baseURL && !isAbsolute(url) && !isHttp(url)) {
      url = `${baseURL}${url}`
    }
    const _option: TransformRequestOption = {
      url, method, headers, body, mode, cache, credentials, redirect, referrer
    }
    // 通过处理函数，返回新的配置文件
    if (typeof transformRequest === 'function') {
      transformRequest.call(this, _option)
    }
    // 解析uri和配置
    const { url: _fetchUri, ..._fetchOptions } = _option
    // TODO timeout
    return fetch(_fetchUri, _fetchOptions).then((response: Response) => {
      const { status, statusText } = response
      if (typeof validateStatus === 'function' && !validateStatus(status)) {
        return Promise.reject(new Error(`${statusText} - STATUS: ${status}`))
      }
      // 自定义处理函数
      if (typeof transformResponse === 'function') {
        return transformResponse(response)
      }
      // 默认使用指定类型处理
      if (responseType) {
        return response[responseType]()
      }
      return response
    })
  }
}
