import { type HttpRequest, type HttpResponse } from './Types'

export interface IHttpClient {
  /**
   * Sends an HTTP request and returns an HTTP response.
   * @param {HttpRequest} request - The HTTP request to send.
   * @returns {Promise<HttpResponse<T>>} A `Promise` that resolves to an HTTP response object.
   */
  request: <T = any>(request: HttpRequest) => Promise<HttpResponse<T>>
}
