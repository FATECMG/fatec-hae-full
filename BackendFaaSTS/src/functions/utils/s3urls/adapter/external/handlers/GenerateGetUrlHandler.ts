import { PreSignedURLContainer } from '@functions/utils/s3urls/shared/Di.container'
import { GenerateUrlControllerLocator } from '@functions/utils/s3urls/shared/Di.enums'
import { type GenerateGetURLController } from '@functions/utils/s3urls/controller/GenerateGetUrlController'

import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

const controller = PreSignedURLContainer.get<GenerateGetURLController>(GenerateUrlControllerLocator.GenerateGetUrlController)

const getGetURLHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, _context) => {
  _context.callbackWaitsForEmptyEventLoop = false

  const resourceId = event?.queryStringParameters?.resourceId
  const resourceType = event?.queryStringParameters?.resourceType

  if (resourceId === undefined || resourceType === undefined) {
    return formatJSONResponse({ body: 'Parâmetros Inválidos!' }, 406)
  }

  const response = await controller.handle({ resourceId, resourceType })

  return formatJSONResponse({
    body: response.data
  }, response.statusCode)
}

export const getPreSignedGetURL = middyfy(getGetURLHandler)
