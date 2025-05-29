import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type DeleteController } from '@common/domain/Controllers'

import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const deleteProjectController = ProjectDependencies.get<DeleteController>(ProjectControllerLocator.DeleteProjectController)
const deleteProjectHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await deleteProjectController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const deleteProject = middyfy(deleteProjectHandler)
