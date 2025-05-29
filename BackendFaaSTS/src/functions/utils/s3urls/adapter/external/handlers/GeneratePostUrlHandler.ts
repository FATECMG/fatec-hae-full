import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import type GeneratePostUrlSchema from '@functions/utils/s3urls/adapter/external/GeneratePostUrlSchema'
import { PreSignedURLContainer } from '@functions/utils/s3urls/shared/Di.container'

import { type GeneratePostURLController } from '@functions/utils/s3urls/controller/GeneratePostUrlController'
import { GenerateUrlControllerLocator } from '@functions/utils/s3urls/shared/Di.enums'

const controller = PreSignedURLContainer.get<GeneratePostURLController>(GenerateUrlControllerLocator.GeneratePostURLController)

const getPostURLHandler: ValidatedEventAPIGatewayProxyEvent<typeof GeneratePostUrlSchema> = async (event, _context) => {
  _context.callbackWaitsForEmptyEventLoop = false

  console.log(event.body)

  const response = await controller.handle({
    files: event.body.files,
    resourceId: event.body.resourceId,
    resourceType: event.body.resourceType
  })

  return formatJSONResponse({
    body: response.data
  }, response.statusCode)
}

export const getPreSignedPostURL = middyfy(getPostURLHandler)
