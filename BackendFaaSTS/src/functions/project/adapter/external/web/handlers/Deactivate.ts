import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type DeactivateController } from '@common/domain/Controllers'

import { type Project } from '@functions/project/entities/Project'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const deactivateProjectController = ProjectDependencies.get<DeactivateController<Project>>(ProjectControllerLocator.DeactivateProjectController)
const deactivateProjectHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await deactivateProjectController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const deactivateProject = middyfy(deactivateProjectHandler)
