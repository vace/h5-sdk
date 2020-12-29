import _md5 from 'blueimp-md5'
import { isObject, keys, global } from '../functions/common'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

class InvalidCharacterError extends Error { }

/** binary to assic */
export const btoa = global.btoa || function (input: string) {
  var str = String(input);
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars, output = '';
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
  }
  return output;
}

/** ascii to binary */
export const atob = global.atob || function (input: string) {
  var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}

/** md5 */
export const md5: (str: string, key?: string) => string = _md5

/** 对数据签名 */
export function signature (object: Record<string, any>, action: string = ''): string {
  // 字典排序
  const signstr = action + keys(object).sort().map(key => {
    const value = object[key]
    return `${key}=${isObject(value) ? JSON.stringify(value) : value}`
  }).join('&')
  return md5(signstr)
}

/**
 * jwt解码，形式如 header.body.signature
 * @param {string} token
 */
export function jwtDecode (token: string): any {
  try {
    return _autoJwtDecode(token)
  } catch (error) {
    return false
  }
}

function _autoJwtDecode (token: string) {
  let [, body] = token.split('.')
  body = body.replace(/-/g, '+').replace(/_/g, '/')
  switch (body.length % 4) {
    case 0:
      break
    case 2:
      body += '=='
      break
    case 3:
      body += '='
      break
  }
  try {
    return JSON.parse(_b64DecodeUnicode(body))
  } catch (error) {
    return JSON.parse(atob(body))
  }
}
function _b64DecodeUnicode (str: string) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase()
    if (code.length < 2) {
      code = '0' + code
    }
    return '%' + code
  }))
}
