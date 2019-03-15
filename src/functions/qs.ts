/**
 * @module sdk
 */

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

import { isArray, isString, isBoolean, isNumber, isHasOwn, isObject } from './is'
import { each } from './underscore'

function encodePrimitive(value: any): string {
  let out = value
  if (isBoolean(value)) out = value ? 'true' : 'false'
  // fxied json mode
  else if (isObject(value)) out = JSON.stringify(value)
  return encodeURIComponent(out)
}

/**
 * 通过遍历给定的 obj 对象的自身属性，生成 URL 查询字符串
 * 如果子对象为json格式，将会使用JSON.stringify(value)序列化
 * @example
 * sdk.stringify({name: 'vace', age: 18, json: {a: 1}}) // name=vace&age=18&json={a:1}
 * @param {Object} obj 要序列化成 URL 查询字符串的对象
 * @param {string} sep 用于界定查询字符串中的键值对的子字符串。默认为 '&'
 * @param {string} eq 用于界定查询字符串中的键与值的子字符串。默认为 '='
 * @param {string} name 进一步序列化查询字符串
 * @returns {string}
 */
export function stringify(obj?: any, sep: string = '&', eq: string = '='): string {
  if (isString(obj)) return obj
  const res: string[] = []
  each(obj, (value: any, key: string) => res.push(key + eq + encodePrimitive(value)))
  return res.join(sep)
}

/**
 * 通过 URL 查询字符串，生成键值格式
 * @example
 * sdk.parse('name=vace&age=18') // {name:'vace', age: '18'}
 * @param {string} qs 
 * @param {string} sep 用于界定查询字符串中的键值对的子字符串。默认为 '&'
 * @param {string} eq 用于界定查询字符串中的键与值的子字符串。默认为 '='
 */
export function parse(qs: string, sep: string = '&', eq: string = '=') {
  var obj: {[key: string]: any} = {}
  if (typeof qs !== 'string' || !qs) {
    return obj
  }
  var regexp = /\+/g
  const qsSplit: string[] = qs.split(sep)
  var len = qsSplit.length
  for (var i = 0; i < len; ++i) {
    var x = qsSplit[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr, vstr, k, v

    if (idx >= 0) {
      kstr = x.substr(0, idx)
      vstr = x.substr(idx + 1)
    } else {
      kstr = x
      vstr = ''
    }
    k = decodeURIComponent(kstr)
    v = decodeURIComponent(vstr)
    if (!isHasOwn(obj, k)) {
      obj[k] = v
    } else if (isArray(obj[k])) {
      obj[k].push(v)
    } else {
      obj[k] = [obj[k], v]
    }
  }
  return obj
}
