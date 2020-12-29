import Http, { HttpError, HttpMethod } from './Http'

// @ts-ignore
const fetch = require('node-fetch')
// @ts-ignore
const { Headers, Request, Response } = require('node-fetch')

Http.HttpHeaders = Headers
Http.HttpRequest = Request
Http.HttpResponse = Response
Http.request = (url: string, request: Request) => {
  if (request.method === HttpMethod.JSONP) {
    throw new HttpError(-1, 'not support method: JSONP', request as any)
  }
  return fetch(url, request)
}

export default Http
