import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type ActivateController } from '@common/domain/Controllers'

import { type Project } from '@functions/project/entities/Project'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const activateProjectController = ProjectDependencies.get<ActivateController<Project>>(ProjectControllerLocator.ActivateProjectController)
const activateProjectHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await activateProjectController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const activateProject = middyfy(activateProjectHandler)
