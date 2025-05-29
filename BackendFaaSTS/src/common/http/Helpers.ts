import { type HttpResponse } from './Types'

export const ok = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 200, data })

export const created = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 201, data })

export const badRequest = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 400, data })

export const unauthorized = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 401, data })

export const unauthenticated = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 403, data })

export const notFound = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 404, data })

export const serverError = (error: Error): HttpResponse<string> => ({ statusCode: 500, data: error.message })

export const serviceUnavailable = <T = any>(data: T): HttpResponse<T> => ({ statusCode: 503, data })
