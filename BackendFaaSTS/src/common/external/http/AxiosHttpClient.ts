import { type IHttpClient } from '@common/http/Client'
import { type HttpRequest, type HttpResponse } from '@common/http/Types'
import { axiosInstance } from '@common/external/http/AxiosInstance'

import { injectable } from 'inversify'

@injectable()
export class AxiosHttpClient implements IHttpClient {
  /**
   * Sends an HTTP request using the Axios library and returns an HTTP response.
   * @param {HttpRequest} request - The HTTP request to send.
   * @returns {Promise<HttpResponse<T>>} A `Promise` that resolves to an HTTP response object.
   */
  async request<T = any>(request: HttpRequest): Promise<HttpResponse<T>> {
    const { method, url, body } = request

    const response = await axiosInstance.request<T>({
      method,
      url,
      data: body
    })

    return {
      statusCode: response.status,
      data: response.data
    }
  }
}
