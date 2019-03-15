/**
 * @const
 * @type {RegExp}
 * @default
 * 是否为http匹配的正则表达式，存在//www.example.com的情况
 */
export const regexHttp: RegExp = /^(https?:|s?ftp:)?\/\/\S+$/i

/**
 * @const
 * @type {RegExp}
 * @default
 * base64匹配的正则表达式
 */
export const regexBase64: RegExp = /^data:(.+);base64,/i

/**
 * @const
 * @type {RegExp}
 * @default
 * 是否为数字的正则表达式(正数、负数、和小数)
 */
export const regexNumber: RegExp = /^(\-|\+)?\d+(\.\d+)?$/

/**
 * @const
 * @type {RegExp}
 * @default
 * 是否为电话号码的正则表达式
 */
export const regexMobile: RegExp = /^1[3-9]\d{9}$/

/**
 * @const
 * @type {RegExp}
 * @default
 * 是否为中文的正则表达式
 */
export const regexChinese: RegExp = /^[\u0391-\uFFE5]+$/

/**
 * @const
 * @type {RegExp}
 * @default
 * 使用正则匹配和分割目录
 */
export const regexSplitPath: RegExp = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
