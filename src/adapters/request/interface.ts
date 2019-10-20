import Auth from "../../factory/Auth"

export type IRequest = (config: IHttpOption & IHttpRequestOption) => Promise<any>

/** 服务端约定返回格式 */
export type ICommonResponseData = {
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
export interface IHttpRequestBase {
  // 附带参数
  method?: 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'JSONP'
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
export interface IHttpOption extends IHttpRequestBase {
  /** 设置请求的headerAuth */
  auth?: Auth,
  /** 根路径 */
  baseURL?: string
  /** 超时时间 */
  timeout?: number
  /** 对请求对象进行转换 */
  transformRequest?: (arg: ITransformRequestOption) => any
  /** 对响应对象进行转换 */
  transformResponse?: (res: Response) => any
  /** 返回数据格式 */
  responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
  /** 验证数据有效性，默认`status>=200` and `status<300` */
  validateStatus?: (status: number) => boolean
}

/** 转换请求参数 */
export interface ITransformRequestOption extends RequestInit {
  /** 接口请求链接 */
  url: string
}

/** 默认请求格式 */
export interface IHttpRequestOption extends IHttpRequestBase {
  url: string
  query?: any
  params?: any
  data?: any
}

/** 可用方法签名 */
export enum Method {
  GET = 'GET',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  JSONP = 'JSONP'
}

/** 可用ContentType */
export enum ContentType {
  UrlEncode = 'application/x-www-form-urlencoded; charset=utf-8',
  JSON = 'application/json; charset=utf-8'
}
