import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { AuthLocator } from '@functions/auth/shared/Di.enums'
import { AuthContainer } from '@functions/auth/shared/Di.container'
import { type GetUserByTokenController } from '@functions/auth/controller/GetUserByTokenController'
import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'

const controller = AuthContainer.get<GetUserByTokenController>(AuthLocator.GetUserByTokenController)

export const GetUserDataByTokenHandler = async (req: any): Promise<HttpResponse<FieldError[] | FieldError | string | UserDataResponse>> => {
  const request = req.body
  const param = {
    accessToken: request.accessToken
  }
  const response = await controller.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
