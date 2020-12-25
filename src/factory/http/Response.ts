import Body from './Body'
import Headers from './Headers'

const redirectStatuses = [301, 302, 303, 307, 308]

export default class _Response extends Body implements Response {
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
