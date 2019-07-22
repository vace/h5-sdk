import { assign } from 'es6-object-assign'
import { HttpOption, Method, HttpRequestOption } from "../adapters/request/interface";
import { request } from '../adapters/request/index'

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
    this.option = assign({}, Http.option, _option)
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
    const config: HttpRequestOption & HttpOption = assign({}, option, this.option)
    return request(config)
  }
}

// TODO 上传进度支持
// function futch(url, opts = {}, onProgress) {
//   return new Promise((res, rej) => {
//     var xhr = new XMLHttpRequest();
//     xhr.open(opts.method || 'get', url);
//     for (var k in opts.headers || {})
//       xhr.setRequestHeader(k, opts.headers[k]);
//     xhr.onload = e => res(e.target.responseText);
//     xhr.onerror = rej;
//     if (xhr.upload && onProgress)
//       xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
//     xhr.send(opts.body);
//   });
// }
