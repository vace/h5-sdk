import Headers from "./Headers"

const supports = {
  Blob: typeof Blob !== 'undefined',
  FormData: typeof FormData !== 'undefined',
  URLSearchParams: typeof URLSearchParams !== 'undefined',
}

export default class _Body implements Body {
  public bodyUsed: boolean = false
  public headers = new Headers()
  public body!: any

  public _bodyInit: any
  public _bodyText!: any
  public _bodyBlob!: Blob
  public _bodyFormData!: FormData
  public _bodyArrayBuffer!: ArrayBuffer

  public constructor () {}

  protected _initBody (body?: any) {
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

  public blob () {
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

  public arrayBuffer (): Promise<ArrayBuffer> {
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

  public text () {
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

  public formData () {
    if (supports.FormData) {
      throw new Error('The environment is not supported `FormData`');
    }
    return this.text().then(decode)
  }

  public json () {
    return this.text().then(JSON.parse)
  }
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

function fileReaderReady(reader: any):Promise<ArrayBuffer> {
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
