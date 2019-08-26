import { ICommonResponseData } from '../adapters/request/interface';

/**
 * 通用http错误处理
 * @ignore
 * @param {ICommonResponseData} response
 * @returns {Promise<Error> | Promise<any>}
 */
export function commonResponseReslove(response: ICommonResponseData): Promise<Error> | Promise<any> {
  if (!response) {
    return Promise.reject(new Error('响应内容为空！'))
  }
  const { code, data, message, msg } = response
  if (code) {
    const error = new Error(message || msg)
    error['code'] = code
    error['data'] = data
    return Promise.reject(error)
  }
  return Promise.resolve(data)
}
