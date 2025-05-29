import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import type Schema from '@functions/auth/adapter/external/web/AuthSchema'
import { AuthLocator } from '@functions/auth/shared/Di.enums'
import { AuthContainer } from '@functions/auth/shared/Di.container'
import { type AuthController } from '@functions/auth/controller/AuthController'
import type AuthRequestUserDataSchema from '@functions/auth/adapter/external/web/AuthRequestUserDataSchema'
import { type GetUserByTokenController } from '@functions/auth/controller/GetUserByTokenController'

const controller = {
  authController: AuthContainer.get<AuthController>(AuthLocator.AuthController),
  getUserDataController: AuthContainer.get<GetUserByTokenController>(AuthLocator.GetUserByTokenController)
}

const postAuthHandler: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const request = event.body
  const param = {
    email: request.email,
    password: request.password
  }
  const result = await controller.authController.handle(param)
  return formatJSONResponse({ body: result.data }, result.statusCode)
}

const getUserDataHandler: ValidatedEventAPIGatewayProxyEvent<typeof AuthRequestUserDataSchema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const request = event.body
  const result = await controller.getUserDataController.handle(request)
  return formatJSONResponse({ body: result.data }, result.statusCode)
}
export const getUserData = middyfy(getUserDataHandler)
export const postAuth = middyfy(postAuthHandler)
