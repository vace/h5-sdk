import { dirname, filterURL, isBase64, isHttp, parse, resolvePath, global } from '../functions/common'

const lt = global.location

/** 受保护的字段列表 */
const PrivacyFileds = ['code', 'state', 'nonce', 'token', 'key', 'secret', 'signatue', 'spm_uid', 'spm_from']

export default {
  PrivacyFileds,
  /** 当前路径，查询字符串 */
  get querystring () {
    return lt.search.slice(1)
  },
  /** 查询字符串序列化 */
  get query () {
    return parse(this.querystring)
  },
  /** 当前根路径 */
  get rootpath () {
    return lt.origin + dirname(lt.pathname) + '/'
  },
  /** 当前路径url */
  get url (): string {
    return lt.href.split('#').shift() || ''
  },
  /** 脱敏链接 */
  get safeurl (): string {
    return filterURL(this.url, this.PrivacyFileds)
  },
  /** 获取当前根路径下的指定文件 */
  getRootFile (filename: string) {
    if (isHttp(filename) || isBase64(filename)) {
      return filename
    }
    return resolvePath(this.rootpath, filename)
  }
}
