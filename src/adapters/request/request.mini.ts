import { IHttpOption, IHttpRequestOption, Method, ContentType, ITransformRequestOption } from "./interface";
import { isString, isFormData, isObject, isHttp } from "../../functions/is";
import { stringify } from "../../functions/qs";
import { isAbsolute } from "../../functions/path";

export interface WxRequestCallbackResult {
  /** 开发者服务器返回的数据 */
  data: string | object | ArrayBuffer;
  /** 开发者服务器返回的 HTTP Response Header
   *
   * 最低基础库： `1.2.0` */
  header: object;
  /** 开发者服务器返回的 HTTP 状态码 */
  statusCode: number;
}

type RequestSuccessCallback = (result: WxRequestCallbackResult) => void;

interface WxRequestOption {
  /** 开发者服务器接口地址 */
  url: string;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: Function;
  /** 请求的参数 */
  data?: string | object | ArrayBuffer;
  /** 返回的数据格式
   *
   * 可选值：
   * - 'json': 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse;
   * - '其他': 不对返回的内容进行 JSON.parse; */
  dataType?: 'json' | '其他';
  /** 接口调用失败的回调函数 */
  fail?: Function;
  /** 设置请求的 header，header 中不能设置 Referer。
   *
   * `content-type` 默认为 `application/json` */
  header?: object;
  /** HTTP 请求方法
   *
   * 可选值：
   * - 'OPTIONS': HTTP 请求 OPTIONS;
   * - 'GET': HTTP 请求 GET;
   * - 'HEAD': HTTP 请求 HEAD;
   * - 'POST': HTTP 请求 POST;
   * - 'PUT': HTTP 请求 PUT;
   * - 'DELETE': HTTP 请求 DELETE;
   * - 'TRACE': HTTP 请求 TRACE;
   * - 'CONNECT': HTTP 请求 CONNECT; */
  method?:
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT';
  /** 响应的数据类型
   *
   * 可选值：
   * - 'text': 响应的数据为文本;
   * - 'arraybuffer': 响应的数据为 ArrayBuffer;
   *
   * 最低基础库： `1.7.0` */
  responseType?: 'text' | 'arraybuffer';
  /** 接口调用成功的回调函数 */
  success?: RequestSuccessCallback;
}
declare var wx: {
  request(option: WxRequestOption): void
}


/**
 * 小程序版本request
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
 * @returns
 */
export default function createRequestMini () {
  return function (config: IHttpOption & IHttpRequestOption) {
    return new Promise((resolve, reject) => {
      const {
        method, mode, cache, credentials, redirect, referrer,
        baseURL, timeout, transformRequest, transformResponse, responseType, validateStatus,
        auth
      } = config
      let headers = config.headers || {}
      let { url, params, data, body, query } = config
      const StrContentType = 'content-type'
      // 根据 content type 处理body
      let contentType = headers[StrContentType]
      // get
      if (method === Method.GET || method === Method.HEAD || method === Method.DELETE || method === Method.OPTIONS) {
        body = void 0 // clear body
        let queryParams = query || params || data
        if (queryParams) { // 参数组合
          url += (url.indexOf('?') === -1 ? '?' : '&') + (isString(queryParams) ? queryParams : stringify(queryParams))
        }
        if (!contentType) {
          headers[StrContentType] = ContentType.JSON
        }
      } else {
        body = data || body
        // 上传文件
        if (isFormData(body)) {
          console.error('小程序端不支持FormData结构')
        } else if (isString(body)) {
          contentType = ContentType.UrlEncode
        } else if (isObject(body)) {
          if (contentType === ContentType.UrlEncode) {
            body = stringify(body)
          } else {
            // 对象默认进行json编码
            contentType = ContentType.JSON
            body = JSON.stringify(body)
          }
        }
        if (contentType) headers[StrContentType] = contentType
      }
      // 设置了根路径，在远程路径 或者结对路径下，忽略设置
      if (baseURL && !isHttp(url) && !isAbsolute(url)) {
        url = `${baseURL}${url}`
      }
      const _option: ITransformRequestOption = {
        url, method, headers, body, mode, cache, credentials, redirect, referrer
      }
      // 使用自定义的用户凭证信息
      if (auth && auth.isAccessTokenValid) {
        if (!headers['authorization']) {
          headers['authorization'] = auth.accessToken
        }
      }
      // 通过处理函数，返回新的配置文件
      if (typeof transformRequest === 'function') {
        transformRequest.call(config, _option)
      }
      // 解析uri和配置
      const { url: _fetchUri, ..._fetchOptions } = _option
      return wx.request({
        url: _option.url,
        data: <any> _option.body,
        header: _option.headers,
        method: <any> _option.method,
        dataType: 'json',
        responseType: 'text',
        success: response => {
          const { statusCode, header } = response
          const data = <any> response.data
          if (typeof validateStatus === 'function' && !validateStatus(statusCode)) {
            const error: any = new Error(`接口响应失败 - STATUS: ${statusCode}`)
            if (isObject(data)) {
              if ('code' in data) {
                error.code = data.code
              }
              if ('message' in data) {
                error.message = data.message
              }
              if ('data' in data) {
                error.data = data.data
              } else {
                error.data = data
              }
            }
            return reject(error)
          }
          // 自定义处理函数
          if (typeof transformResponse === 'function') {
            return resolve(transformResponse(<any>response))
          }
          return resolve(data)
        }
      })
    })
  }
}
