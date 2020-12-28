import { isBoolean } from '../functions/common'
import { jsonp } from '../functions/utils.web'
import Http, { HttpMethod } from './Http'
import { loading, error, success } from '../plugins/ui.web'

Http.HttpHeaders = Headers
Http.HttpRequest = Request
Http.HttpResponse = Response
Http.request = async (url: string, request: Request) => {
  if (request.method === HttpMethod.JSONP) {
    const json = await jsonp(url)
    return new Response(JSON.stringify(json))
  }
  return fetch(url, request)
}

// 注册loading
Http.showLoading = message => loading(message)
Http.showError = message => error(message)
Http.showSuccess = message => success(message)

export default Http
