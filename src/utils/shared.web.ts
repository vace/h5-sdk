import { dirname, resolvePath } from '../functions/path';
import { location } from './global';
import { parse, stringify } from '../functions/qs';
import { isArray } from '../functions/is';
import { each } from '../functions/underscore';

/**
 * Object.assign别名
 * @ignore
 */
export const assign = Object.assign

/** 受保护的字段列表 */
const DefaultPrivacyFileds = [
  'code',
  'state',
  'nonce',
  'token',
  'key',
  'secret',
  'signatue',
  'spm_uid',
  'spm_from'
]
/**
 * 获取当前路径
 * @param {boolean|string[]} isPrivacy 是否过滤收保护的字段，比如token之类的字段，可自定义过滤字段
 * @ignore
 */
export function getCurrentHref(isPrivacy?: boolean | string[]): string {
  let url = <string>location.href.split('#').shift() || ''
  if (isPrivacy) {
    const [host, query] = url.split('?')
    if (query) {
      const object: any = parse(query)
      const PrivacyFileds = isArray(isPrivacy) ? isPrivacy : DefaultPrivacyFileds
      //! 以双下划线__开头的也会被移除
      each(object, (value: any, key: string) => {
        if ((typeof key === 'string' && key.slice(0, 2) === '__') || PrivacyFileds.indexOf(key) !== -1) {
          delete object[key]
        }
      })
      const newquery = stringify(object)
      if (newquery) {
        url = host + '?' + newquery
      } else {
        url = host
      }
    }
  }
  return url
}

/**
 * 获取当前目录下文件
 * @ignore
 */
export function getCurrentPathFile(filename: string = ''): string {
  return dirname(<string>location.href.split('?').shift()) + '/' + filename
}

// export function jsonp (src) {
//   var jsonpScript = document.createElement('script');
//   jsonpScript.setAttribute("src", src);
//   document.getElementsByTagName("head")[0].appendChild(jsonpScript)
// }
