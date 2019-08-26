import { isString, isFormData, isObject, isHttp } from '../../functions/is'
import { stringify } from '../../functions/qs';
import { isAbsolute } from '../../functions/path';

import { ITransformRequestOption, IHttpOption, IHttpRequestOption, Method, ContentType } from "./interface";


/**
 *加载前，请确保已经引入了fetch.js
 *
 * @export
 * @returns
 */
export default function createRequestNode() {
  // fetch 对象
  const fetch = require('node-fetch')
  const Headers = require('node-fetch').Headers

  return function (config: IHttpOption & IHttpRequestOption) {
    const {
      method, mode, cache, credentials, redirect, referrer,
      baseURL, timeout, transformRequest, transformResponse, responseType, validateStatus
    } = config
    let headers = new Headers(config.headers || {})
    let { url, params, data, body, query } = config
    const StrContentType = 'Content-Type'
    // 根据 content type 处理body
    let contentType = headers.get(StrContentType)
    // get
    if (method === Method.GET || method === Method.HEAD || method === Method.DELETE || method === Method.OPTIONS) {
      body = void 0 // clear body
      let queryParams = query || params || data
      if (queryParams) { // 参数组合
        url += (url.indexOf('?') === -1 ? '?' : '&') + (isString(queryParams) ? queryParams : stringify(queryParams))
      }
      if (!contentType) {
        headers.set(StrContentType, ContentType.JSON)
      }
    } else {
      body = data || body
      // 上传文件
      if (isFormData(body)) {
        headers.delete(StrContentType)
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
      if (contentType) headers.set(StrContentType, contentType)
    }
    // 设置了根路径，在远程路径 或者结对路径下，忽略设置
    if (baseURL && !isHttp(url) && !isAbsolute(url)) {
      url = `${baseURL}${url}`
    }
    const _option: ITransformRequestOption = {
      url, method, headers, body, mode, cache, credentials, redirect, referrer
    }
    // 通过处理函数，返回新的配置文件
    if (typeof transformRequest === 'function') {
      transformRequest.call(config, _option)
    }
    // 解析uri和配置
    const { url: _fetchUri, ..._fetchOptions } = _option
    // TODO timeout
    return fetch(_fetchUri, _fetchOptions).then((response: Response) => {
      const { status, statusText, headers } = response
      if (typeof validateStatus === 'function' && !validateStatus(status)) {
        const error: any = new Error(`${statusText} - STATUS: ${status}`)
        const ContentType = headers.get('Content-Type')
        if (ContentType && ContentType.indexOf('application/json') !== -1) {
          return response.json().then(err => {
            if ('code' in err) {
              error.code = err.code
            }
            if ('message' in err) {
              error.message = err.message
            }
            if ('data' in err) {
              error.data = err.data
            } else {
              error.data = err
            }
            return Promise.reject(error)
          })
        }
        return Promise.reject(error)
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
