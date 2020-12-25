import Http, { HttpError, HttpMethod } from './Http'

const fetch = require('node-fetch')
const { Headers, Request, Response } = require('node-fetch')

Http.HttpHeaders = Headers
Http.HttpRequest = Request
Http.HttpResponse = Response
Http.request = async (url: string, request: Request) => {
  if (request.method === HttpMethod.JSONP) {
    throw new HttpError(-1, 'not support method: JSONP', request as any)
  }
  return fetch(url, request)
}

export default Http
