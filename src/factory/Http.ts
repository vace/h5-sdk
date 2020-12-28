import { always, assign, isString, isHttp, inArray, createURL, noop, isFunction, isObject, isBoolean } from "../functions/common"

const MessageKey = Symbol('$msg')

export interface IHttpConfig {
  baseURL?: string
  validateStatus: (code: number) => boolean
  transformRequest: (req: IHttpRequestOption) => IHttpRequestOption
  transformResponse: (rsp: Response) => any
  onHeadersReceived: (headers: Headers) => void
  // onCookiesReceived: (cookies: Headers) => void
}

export interface IHttpRequestOption {
  url?: string
  query?: any
  body?: any
  param?: any
  data?: any

  headers?: HeadersInit
  method?: HttpMethod

  showLoading?: any
  showError?: any
  showSuccess?: any
  // 任意继承Request的配置，由实现体完成
  [key: string]: any
}

type HttpRequestOption = string | IHttpRequestOption
type HttpNofifyCallback = (message: string, data: any) => any

/** 可用方法签名 */
export enum HttpMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  JSONP = 'JSONP'
}


/** http抛出的错误类 */
export class HttpError extends Error {
  public code: number
  public data: any
  public request?: Http
  public response?: Response
  constructor(code: number, message: string, request?: Http, response?: Response) {
    super(message || `网络出错（code: ${code}）`)
    this.code = code
    this.request = request
    this.response = response
  }
}

export default class Http {
  /** 抛出的网络错误类 */
  public static HttpError = HttpError
  /** 内部使用的headers */
  public static HttpHeaders: typeof Headers
  /** 内部使用的response */
  public static HttpResponse: typeof Response
  /** 内部使用的request */
  public static HttpRequest: typeof Request

  // 可用的编码
  public static ContentType  = {
    JSON: 'application/json; charset=utf-8',
    FORM: 'application/x-www-form-urlencoded; charset=utf-8'
  }
  /** 全局加载中处理 */
  public static showLoading: HttpNofifyCallback = noop
  /** 全局错误消息处理 */
  public static showError: HttpNofifyCallback = noop
  /** 全局成功消息处理 */
  public static showSuccess: HttpNofifyCallback = noop
  /** 支持的方法种类 */
  public static Method = HttpMethod
  /** 默认的网络请求配置 */
  public static HttpOption: IHttpConfig = {
    // baseURL: '',
    validateStatus: status => status >= 200 && status < 300,
    transformRequest: always,
    transformResponse: response => response.json(),
    onHeadersReceived: noop,
  }

  public static request (url: string, request: any): Promise<Response> {
    return Promise.resolve(new Response(''))
  }

  /** 默认全局实例 */
  public static instance: Http = new Http()
  /** 实例配置 */
  public httpconf: IHttpConfig
  /** 实例化 */
  public constructor (_option?: IHttpConfig | any) {
    this.httpconf = assign({}, Http.HttpOption, _option)
  }
  /** GET 请求 */
  public get (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.GET)
  }
  /** DELETE 请求 */
  public delete (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.DELETE)
  }
  /** HEAD 请求 */
  public head (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.HEAD)
  }
  /** OPTIONS 请求 */
  public options (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.OPTIONS)    
  }
  /** POST 请求 */
  public post (url: HttpRequestOption, data?: any): Promise<any> {
    return this.action(url, data, HttpMethod.POST)
  }
  /** PUT 请求 */
  public put(url: HttpRequestOption, data?: any): Promise<any> {
    return this.action(url, data, HttpMethod.PUT)
  }
  /** PATCH 请求 */
  public patch(url: HttpRequestOption, data?: any): Promise<any> {
    return this.action(url, data, HttpMethod.PATCH)
  }
  /* JSONP 请求 */
  public jsonp (url: HttpRequestOption, query?: any) {
    return this.action(url, query, HttpMethod.JSONP)
  }
  // 执行指定action
  public action (url: HttpRequestOption, data?: any, method?: HttpMethod): Promise<any> {
    let req: IHttpRequestOption = { data, method }
    if (isString(url)) {
      req.url = url
    } else {
      assign(req, url)
    }
    return this.request(req)
  }

  /** 发送request */
  public request(req: IHttpRequestOption): Promise<any> {
    const HttpHeaders = Http.HttpHeaders
    const { baseURL,
      validateStatus,
      transformRequest,
      transformResponse,
      onHeadersReceived} = this.httpconf
    const request = transformRequest(req) || req
    const { url, query, body, param, data, method = HttpMethod.GET, headers, ...reqOptions } = request

    let requestURL: string = url || ''
    let requestQuery = query
    let requestBody = body
    // 追加请求根路径
    if (baseURL && !isHttp(url)) {
      requestURL = baseURL + url
    }
    // 参数以及别名处理
    if (inArray(method, [HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH])) {
      requestBody = param || body || data
    } else {
      requestQuery = query || param || body || data
    }
    requestURL = createURL(requestURL, requestQuery)

    const notify = (type: string, message: string, data?: any): any => {
      let callback = request[type]
      if (!callback) return // 未定义通知函数
      if (isString(callback)) {
        message = callback
      }
      // true 时使用默认文案
      // if (isBoolean(callback)) {}
      if (!isFunction(callback)) {
        callback = Http[type]
      }
      return callback(message, data)
    }
    const $messages = this[MessageKey]

    // loading handle
    const _loading = notify('showLoading', $messages.loading || '请稍后...')
    const closeLoading = () => {
      _loading && isFunction(_loading.close) && _loading.close()
    }

    let requestHeader = headers
    if (isObject(requestBody)) {
      requestHeader = requestHeader instanceof HttpHeaders ? requestHeader : new HttpHeaders(requestHeader)
      requestHeader.set('Content-Type', Http.ContentType.JSON)
      requestBody = JSON.stringify(requestBody)
    }
    // 拼接请求URL
    return Http.request(requestURL, {
        method,
        body: requestBody,
        headers: requestHeader,
        ...reqOptions
      }).then(response => {
        const { status, statusText } = response
        onHeadersReceived(response.headers)
        if (!validateStatus(status)) {
          throw new HttpError(status, statusText, this, response)
        }
        return response
      })
      .then(response => {
        // head 和 options 不经过response
        if (method === HttpMethod.OPTIONS || method === HttpMethod.HEAD) {
          return response
        }
        return transformResponse(response)
      })
      .then(data => {
        closeLoading()
        notify('showSuccess', $messages.success || '完成', data)
        return data
      }).catch(error => {
        closeLoading()
        notify('showError', error.message || $messages.error, error)
        throw error
      })
  }

  // 自定义文案
  private [MessageKey] = {
    success: '',
    error: '',
    loading: ''
  }
  // 用于设置响应中的提示内容
  public setHttpMessage (key: string, message: string) {
    this[MessageKey][key] = message
  }
}
