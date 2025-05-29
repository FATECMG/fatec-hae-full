import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { type FindOneController } from '@common/domain/Controllers'

import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'

const findOneProjectController = ProjectDependencies.get<FindOneController<Project, ProjectPM>>(ProjectControllerLocator.FindOneProjectController)
const getProjectHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await findOneProjectController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getProject = middyfy(getProjectHandler)
