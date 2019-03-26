import { isString, isObject, isHttp, isFormData } from "../functions/is";
import { stringify } from "../functions/qs";
import { isAbsolute } from "../functions/path";

/** 服务端约定返回格式 */
export type CommonResponseData = {
  /** 错误码，无错误返回0 */
  code: number
  /** 返回数据 */
  data: any
  /** 返回消息文本 */
  message: string
  /** 兼容老版本API */
  msg?: string
}

/** Http请求参数 */
export interface HttpRequestBase {
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

/** Http配置 */
export interface HttpOption extends HttpRequestBase{
  /** 根路径 */
  baseURL?: string
  /** 超时时间 */
  timeout?: number
  /** 对请求对象进行转换 */
  transformRequest?: (arg: TransformRequestOption) => any
  /** 对响应对象进行转换 */
  transformResponse?: (res: Response) => any
  /** 返回数据格式 */
  responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
  /** 验证数据有效性，默认`status>=200` and `status<300` */
  validateStatus?: (status: number) => boolean
}

/** 转换请求参数 */
export interface TransformRequestOption extends RequestInit {
  /** 接口请求链接 */
  url: string
}

/** 默认请求格式 */
export interface HttpRequestOption extends HttpRequestBase {
  url: string
  params?: any
  data?: any
}

/** 可用方法签名 */
enum Method {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH'
}

/** 可用ContentType */
enum ContentType {
  UrlEncode = 'application/x-www-form-urlencoded;charset=utf-8',
  JSON = 'application/json;charset=utf-8'
}

/**
 * 处理网络请求
 * @class Http
 */
export default class Http {
  /**
   * 全局配置
   * @static
   * @type {HttpOption}
   */
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

  private static _instance: Http
  /** 获取实例 */
  public static get instance (): Http {
    if (!this._instance) {
      this._instance = new Http()
    }
    return this._instance
  }
  /** 实例配置 */
  public option: HttpOption
  /**
   * 创建指定格式实例
   * @param {HttpOption} [_option] 配置
   */
  public constructor (_option?: HttpOption) {
    this.option = Object.assign({}, Http.option, _option)
  }
  /** GET 请求 */
  public get (url: string, params?: any): Promise<any> {
    return this.request({url, method: Method.GET, params })
  }
  /** DELETE 请求 */
  public delete (url: string, params?: any): Promise<any> {
    return this.request({ url, method: Method.DELETE, params })
  }
  /** HEAD 请求 */
  public head (url: string, params?: any): Promise<any> {
    return this.request({ url, method: Method.HEAD, params })
  }
  /** OPTIONS 请求 */
  public options (url: string, params?: any): Promise<any> {
    return this.request({ url, method: Method.OPTIONS, params })    
  }
  /** POST 请求 */
  public post (url: string, data?: any): Promise<any> {
    return this.request({ url, method: Method.POST, data })
  }
  /** PUT 请求 */
  public put(url: string, data?: any): Promise<any> {
    return this.request({ url, method: Method.PUT, data })
  }
  /** PATCH 请求 */
  public patch(url: string, data?: any): Promise<any> {
    return this.request({ url,  method: Method.PATCH, data })
  }
  /** 发送request */
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
