import Auth from './Auth'
import { always, assign, isString, isPromise, isHttp, inArray, createURL, noop, isFunction, isObject, now, isDef, isNumber, isFormData, isBlob, isFile } from "../functions/common"

const HttpMessage = Symbol('$message')
const HttpCache   = Symbol('$cache')

/** 请求格式 */
type HttpRequestOption = string | IHttpRequestOption
/** ui提示逻辑 */
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

type SendRequest = (url: HttpRequestOption, query?: any, options?: any) => Promise<any>

/**
 * http抛出的错误类
 */
export class HttpError extends Error {
  /** 错误代码 */
  public code: number
  /** 携带的错误数据 */
  public data: any
  /** 请求类 */
  public request?: Http
  /** 响应结果 */
  public response?: Response
  /**
   * 初始化http错误对象
   * @param code 错误码
   * @param message 错误消息
   * @param request 请求类
   * @param response 响应结果
   */
  constructor(code: number, message: string, request?: Http, response?: Response) {
    super(message || `网络出错（code: ${code}）`)
    this.code = code
    this.request = request
    this.response = response
  }
}

/**
 * Http请求类
 */
export default class Http {
  /** 抛出的网络错误类 */
  public static HttpError = HttpError
  /** 内部使用的headers */
  public static HttpHeaders: typeof Headers
  /** 内部使用的response */
  public static HttpResponse: typeof Response
  /** 内部使用的request */
  public static HttpRequest: typeof Request
  /** 可用的编码 */
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
  /** 发送请求，具体实现由所在平台实现 */
  public static request (url: string, request: any): Promise<Response> {
    return Promise.resolve(new Response(''))
  }

  /** 默认全局实例 */
  public static instance: Http = new Http()
  /** 实例配置 */
  public httpconfig: IHttpConfig = {}
  /** 请求缓存 */
  public [HttpCache]: Map<string, IHttpCache> = new Map()
  /** 自定义文案 */
  public [HttpMessage] = { success: '', error: '', loading: '' }
  /** 是否携带用户凭证 */
  public auth!: Auth
  /** 仅在子类中使用 */
  protected $tryUseAuth = false

  /** 实例化 */
  public constructor (_option?: IHttpConfig) {
    if (_option) {
      // use and delete
      if (_option.auth) {
        this.auth = _option.auth
        delete _option.auth
      }
      this.httpconfig = assign({}, Http.HttpOption, _option)
    }
  }
  /** 关联Auth */
  public withAuth (auth: Auth) {
    this.auth = auth
    return this
  }

  /** 发送 GET 请求，并返回结果 */
  public get (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.GET)
  }
  /** 发送 DELETE 请求，并返回结果 */
  public delete (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.DELETE)
  }
  /** 发送 HEAD 请求，并返回结果 */
  public head (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.HEAD)
  }
  /** 发送 OPTIONS 请求，并返回结果 */
  public options (url: HttpRequestOption, query?: any): Promise<any> {
    return this.action(url, query, HttpMethod.OPTIONS)    
  }
  /** 发送 POST 请求，并返回结果 */
  public post (url: HttpRequestOption, data?: any): Promise<any> {
    return this.action(url, data, HttpMethod.POST)
  }
  /** 发送 PUT 请求，并返回结果 */
  public put(url: HttpRequestOption, data?: any): Promise<any> {
    return this.action(url, data, HttpMethod.PUT)
  }
  /** 发送 PATCH 请求，并返回结果 */
  public patch(url: HttpRequestOption, data?: any): Promise<any> {
    return this.action(url, data, HttpMethod.PATCH)
  }
  /*  发送JSONP 请求，并返回结果 */
  public jsonp (url: HttpRequestOption, query?: any) {
    return this.action(url, query, HttpMethod.JSONP)
  }
  /** 执行指定action */
  public action (url: HttpRequestOption, data?: any, method?: HttpMethod, extOptions?: any): Promise<any> {
    let req: IHttpRequestOption = assign({ data, method }, isString(url) ? { url } : url, extOptions)
    return this.request(req)
  }
  /** 发送request */
  public request(req: IHttpRequestOption): Promise<any> {
    const auth = <null | Auth>(this.$tryUseAuth ? this : this.auth)
    const HttpHeaders = Http.HttpHeaders
    const httpcache = this[HttpCache]
    const { baseURL, validateStatus, transformRequest, onHeadersReceived } = this.httpconfig
    let { transformResponse } = this.httpconfig
    let request = isFunction(transformRequest) && transformRequest(req) || req
    if (auth) {
      request = auth.transformAuthRequest(request) || request
    }
    const { cache, url, query, body, param, data, method, headers, transformResponse: userTransformResponse, ...reqOptions } = request
    // 使用用户自定义的参数转换方法
    if (userTransformResponse && isFunction(userTransformResponse)) {
      transformResponse = userTransformResponse
    }

    let requestURL: string = url || ''
    let requestQuery = query
    let requestBody = body
    let requestHeader = headers
    let requestMethod = isString(method) ? method.toUpperCase() : HttpMethod.GET
    // 追加请求根路径
    if (baseURL && !isHttp(url)) {
      requestURL = baseURL + url
    }
    // 参数以及别名处理
    if (inArray(requestMethod, [HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH])) {
      requestBody = param || body || data
    } else {
      requestQuery = query || param || body || data
    }
    requestURL = createURL(requestURL, requestQuery)

    /** 缓存处理 */
    let cacheKey: null | string = null
    if (isString(cache)) cacheKey = cache
    else if (isFunction(cache)) cacheKey = cache(requestURL)
    else if (cache) cacheKey = `${requestMethod}:${requestURL}`
    if (cacheKey) {
      if (HttpMethod.GET !== requestMethod) {
        console.error(new TypeError(`Http cache only support method: ${HttpMethod.GET}`))
        cacheKey = null
      } else if (httpcache.has(cacheKey)) {
        const cache = httpcache.get(cacheKey) as IHttpCache
        if (cache.expiretime < now()) {
          httpcache.delete(cacheKey)
        } else {
          return isPromise(cache.data) ? cache.data : Promise.resolve(cache.data)
        }
      }
    }

    const notify = (type: string, message: string, data?: any): any => {
      let callback = request[type]
      if (!callback) return // 未定义通知函数
      if (isString(callback)) {
        message = callback
      }
      if (!isFunction(callback)) {
        callback = Http[type]
      }
      return callback(message, data)
    }

    if (requestBody) {
      // create http file
      if (isFile(requestBody)) {
        const fdata = new FormData()
        fdata.append('file', requestBody)
        requestBody = fdata
      }

      requestHeader = requestHeader instanceof HttpHeaders ? requestHeader : new HttpHeaders(requestHeader)
      if (!requestHeader.get('content-type')) {
        // exclude Formdata, Blob ...
        if (isObject(requestBody) && !isFormData(requestBody) && !isBlob(requestBody)) {
          requestHeader.set('Content-Type', Http.ContentType.JSON)
          requestBody = JSON.stringify(requestBody)
        }
      }
    }

    const $messages = this[HttpMessage]
    // loading handle
    const _loading = notify('showLoading', $messages.loading || '请稍后...')
    const closeLoading = () => {
      _loading && isFunction(_loading.close) && _loading.close()
    }
    // 拼接请求URL
    return Http.request(requestURL, {
        method: requestMethod,
        body: requestBody,
        headers: requestHeader,
        ...reqOptions
      }).then(response => {
        const { status, statusText, headers } = response
        if (auth) {
          auth.onAuthHeadersReceived(headers)
        }
        isFunction(onHeadersReceived) && onHeadersReceived(headers)
        if (isFunction(validateStatus) && !validateStatus(status)) {
          throw new HttpError(status, statusText, this, response)
        }
        return response
      })
      .then(response => {
        // head 和 options 不经过response
        if (requestMethod === HttpMethod.OPTIONS || requestMethod === HttpMethod.HEAD) {
          return response
        }
        return isFunction(transformResponse) ? transformResponse(response, request) : response
      })
      .then(data => {
        closeLoading()
        notify('showSuccess', $messages.success || '完成', data)
        // 缓存响应
        if (cacheKey && isDef(data)) {
          httpcache.set(cacheKey, {
            data: data,
            expiretime: isNumber(cache) ? (now() + cache) : Infinity
          })
        }
        return data
      }).catch(error => {
        closeLoading()
        notify('showError', error.message || $messages.error, error)
        throw error
      })
  }
  /** 用于设置响应中的提示内容 */
  public setHttpMessage (key: string, message: string) {
    this[HttpMessage][key] = message
  }

  /** 使用指定方法(默认GET)请求，并返回text */
  public text (url: HttpRequestOption, query?: any, method = HttpMethod.GET) {
    return this.action(url, query, method, { transformResponse: (res: Response) => res.text() })
  }
  /** 使用指定方法(默认GET)请求，并返回arrayBuffer */
  public arrayBuffer(url: HttpRequestOption, query?: any, method = HttpMethod.GET) {
    return this.action(url, query, method, { transformResponse: (res: Response) => res.arrayBuffer() })
  }
  /** 使用指定方法(默认GET)请求，并返回blob */
  public blob(url: HttpRequestOption, query?: any, method = HttpMethod.GET) {
    return this.action(url, query, method, { transformResponse: (res: Response) => res.blob() })
  }
  /** 使用指定方法(默认GET)请求，并返回formData */
  public formData(url: HttpRequestOption, query?: any, method = HttpMethod.GET) {
    return this.action(url, query, method, { transformResponse: (res: Response) => res.formData() })
  }

  // bind fast methods
  public static get: SendRequest
  public static delete: SendRequest
  public static head: SendRequest
  public static options: SendRequest
  public static post: SendRequest
  public static put: SendRequest
  public static patch: SendRequest
  public static jsonp: SendRequest
  public static action: SendRequest
  public static text: SendRequest
  public static arrayBuffer: SendRequest
  public static blob: SendRequest
  public static formData: SendRequest
}

// install static methods
const staticMethods = [
  'get', 'delete', 'head', 'options', 'post', 'put', 'patch', 'jsonp', 'action',
  'text', 'arrayBuffer', 'blob', 'formData'
]
staticMethods.forEach(method => Http[method] = function (url: HttpRequestOption, query?: any) {
  const instance = this.instance || Http.instance
  return instance[method](url, query)
})

export interface IHttpCache {
  expiretime: number
  data: any
}

export interface IHttpConfig {
  auth?: Auth
  baseURL?: string
  validateStatus?: (code: number) => boolean
  transformRequest?: (req: IHttpRequestOption) => IHttpRequestOption
  transformResponse?: (rsp: Response, req: IHttpRequestOption) => any
  onHeadersReceived?: (headers: Headers) => void
  // onCookiesReceived: (cookies: Headers) => void
}

export interface IHttpRequestOption {
  /** GET请求 支持缓存 */
  cache?: boolean | number | ((fetchURL: string) => string),
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
