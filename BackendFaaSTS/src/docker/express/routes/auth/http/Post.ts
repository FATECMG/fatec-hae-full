import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { AuthLocator } from '@functions/auth/shared/Di.enums'
import { AuthContainer } from '@functions/auth/shared/Di.container'
import { type AuthController } from '@functions/auth/controller/AuthController'
import { type AuthTokenResponse } from '@functions/auth/entities/AuthTokenResponse'

const controller = AuthContainer.get<AuthController>(AuthLocator.AuthController)

export const PostAuthHandler = async (req: any): Promise<HttpResponse<FieldError[] | FieldError | string | AuthTokenResponse>> => {
  const request = req.body
  const param = {
    email: request.email,
    password: request.password
  }
  const response = await controller.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
