import { jsonp } from '../functions/web'
import Http, { HttpMethod } from './Http'

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

export default Http
