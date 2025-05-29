import { type FindAllFromEntityController } from '@common/domain/Controllers'
import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

const getCommentsController = ProjectDependencies
  .get<FindAllFromEntityController<Project, ProjectPM>>(ProjectControllerLocator.FindAllProjectsFromUserController)
const getProjectsFromUserHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await getCommentsController.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getProjectsFromUser = middyfy(getProjectsFromUserHandler)
