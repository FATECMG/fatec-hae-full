export type HttpMethod = 'post' | 'get' | 'put' | 'delete'

export type HttpResponse<T> = {
  statusCode: number
  data?: T
}

export type HttpRequest = {
  body?: any
  method: HttpMethod
  url: string
}
