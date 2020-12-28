import { isHasOwn, keys } from '../functions/common'

const supports = {
  Blob: typeof Blob !== 'undefined',
  FormData: typeof FormData !== 'undefined',
  URLSearchParams: typeof URLSearchParams !== 'undefined',
}

class DOMException extends Error {
  public constructor(message: string, name: string) {
    super(message)
    this.name = name
  }
}

class _Headers implements Headers {
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

class _Body implements Body {
  public bodyUsed: boolean = false
  public headers = new Headers()
  public body!: any

  public _bodyInit: any
  public _bodyText!: any
  public _bodyBlob!: Blob
  public _bodyFormData!: FormData
  public _bodyArrayBuffer!: ArrayBuffer

  public constructor() { }

  protected _initBody(body?: any) {
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (supports.Blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (supports.FormData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body as FormData
    } else if (supports.URLSearchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (body && supports.Blob && DataView.prototype.isPrototypeOf(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if ((ArrayBuffer.prototype.isPrototypeOf(body) || ArrayBuffer.isView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (supports.URLSearchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  public blob() {
    if (supports.Blob) {
      throw new Error('The environment is not supported `Blob`');
    }
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }
    if (this._bodyBlob) {
      return Promise.resolve(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(new Blob([this._bodyArrayBuffer]))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as blob')
    } else {
      return Promise.resolve(new Blob([this._bodyText]))
    }
  }

  public arrayBuffer(): Promise<ArrayBuffer> {
    if (this._bodyArrayBuffer) {
      var isConsumed = consumed(this)
      if (isConsumed) {
        return isConsumed
      }
      if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
        return Promise.resolve(
          this._bodyArrayBuffer.buffer.slice(
            this._bodyArrayBuffer.byteOffset,
            this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
          )
        )
      } else {
        return Promise.resolve(this._bodyArrayBuffer)
      }
    } else {
      return this.blob().then(readBlobAsArrayBuffer)
    }
  }

  public text() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }
    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  public formData() {
    if (supports.FormData) {
      throw new Error('The environment is not supported `FormData`');
    }
    return this.text().then(decode)
  }

  public json() {
    return this.text().then(JSON.parse)
  }
}

class _Request extends _Body implements Request {
  // ignore
  readonly isHistoryNavigation!: boolean;
  readonly isReloadNavigation!: boolean;
  readonly keepalive!: boolean;
  readonly referrerPolicy!: ReferrerPolicy;
  readonly redirect!: RequestRedirect;
  readonly cache!: RequestCache;
  readonly credentials!: RequestCredentials
  readonly destination!: RequestDestination;

  public headers!: Headers
  public integrity!: string
  public url: string = ''
  public method!: string
  public mode!: RequestMode
  public signal!: AbortSignal
  public referrer!: any
  public timeout!: any

  public constructor(input: RequestInfo, options: RequestInit = {}) {
    super()
    var body = options.body

    if (input instanceof _Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      this.signal = input.signal
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        // @ts-ignore
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'same-origin'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.signal = options.signal || this.signal
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)

    if (this.method === 'GET' || this.method === 'HEAD') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        var reParamSearch = /([?&])_=[^&]*/
        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          var reQueryString = /\?/
          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
        }
      }
    }
  }

  public clone (this: any) {
    return new _Request(this, { body: this._bodyInit })
  }
}

const redirectStatuses = [301, 302, 303, 307, 308]

class _Response extends _Body implements Response {
  public static error() {
    var response = new _Response(null, { status: 0, statusText: '' })
    response.type = 'error'
    return response
  }

  public static redirect(url: string, status: number) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }
    return new _Response(null, { status: status, headers: { location: url } })
  }

  readonly trailer!: Promise<Headers>
  readonly redirected!: boolean
  public type: ResponseType = 'default'
  public status: number = 200
  public ok: boolean = true
  public statusText: string = ''
  public url: string

  public constructor(bodyInit, options: any = {}) {
    super()
    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : ''
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  public clone(this: any) {
    return new _Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }
}

export {
  DOMException,
  _Headers as Headers,
  _Body as Body,
  _Request as Request,
  _Response as Response
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method: string) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function bufferClone(buf: ArrayBuffer) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function consumed(body: any) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader: any): Promise<ArrayBuffer> {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function () {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob): Promise<ArrayBuffer> {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
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
