import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import type PasswordValidatorSchema from '@functions/passwordvalidation/adapter/external/PasswordValidatorSchema'
import { PasswordValidatorController } from '@functions/passwordvalidation/controller/PasswordValidatorController'
import { PasswordValidatorUseCase } from '@functions/passwordvalidation/usecases/PasswordValidation'

import { middyfy } from '@libs/Lambda'

const controller = new PasswordValidatorController(new PasswordValidatorUseCase())
const postPasswordValidatorHandler: ValidatedEventAPIGatewayProxyEvent<typeof PasswordValidatorSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false

      const request = event.body.password

      const response = await controller.handle(request)

      return formatJSONResponse({ body: response.data }, response.statusCode)
    }

export const postPasswordValidator = middyfy(postPasswordValidatorHandler)
