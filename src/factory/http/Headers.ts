import { isHasOwn, keys } from '../../functions/common'

export default class _Headers implements Headers {
  public map = {}
  public constructor(headers?: HeadersInit) {
    if (headers instanceof _Headers) {
      // @ts-ignore
      headers.forEach((value, name) => this.append(name, value))
    } else if (Array.isArray(headers)) {
      headers.forEach(header => this.append(header[0], header[1]))
    } else if (headers) {
      keys(headers).forEach(name => this.append(name, headers[name]))
    }
  }
  public append(name: string, value: string) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue + ', ' + value : value
  }

  public delete(name: string) {
    delete this.map[normalizeName(name)]
  }

  public get(name: string) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  public has(name: string) {
    return isHasOwn(this.map, normalizeName(name))
  }

  public set(name: string, value: string) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  public forEach(callback: any, thisArg = this) {
    const map = this.map
    for (var name in map) {
      if (isHasOwn(map, name)) {
        callback.call(thisArg, map[name], name, this)
      }
    }
  }
}

function normalizeName(name: string) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name: "' + name + '"')
  }
  return name.toLowerCase()
}

function normalizeValue(value: string | number) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}
