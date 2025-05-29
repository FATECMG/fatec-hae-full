import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type ActivateController } from '@common/domain/Controllers'

import { type School } from '@functions/school/entities/School'
import { schoolContainer } from '@functions/school/shared/Di.container'
import { SchoolLocator } from '@functions/school/shared/Di.enums'

const schoolController = schoolContainer.get<ActivateController<School>>(SchoolLocator.SchoolActivateController)

const activateSchoolHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await schoolController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const activateSchool = middyfy(activateSchoolHandler)
