import Body from './Body'
import Headers from './Headers'

export default class _Request extends Body implements Request {
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

  public constructor (input: RequestInfo, options: RequestInit = {}) {
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

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method: string) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}
