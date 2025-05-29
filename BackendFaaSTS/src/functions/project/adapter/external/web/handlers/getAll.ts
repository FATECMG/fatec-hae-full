import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import { middyfy } from '@libs/Lambda'

import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { type FindAllProjectController } from '@functions/project/controller/FindAll'

const findAllProjectController = ProjectDependencies.get<FindAllProjectController>(ProjectControllerLocator.FindAllProjectController)
const getProjectsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  let active: boolean = true
  let status: string[] = []

  if (event?.queryStringParameters !== null && ((event?.multiValueQueryStringParameters) != null)) {
    if (event.queryStringParameters.active !== undefined) {
      active = event.queryStringParameters.active !== 'false'
    }

    if (event.multiValueQueryStringParameters.status !== undefined) {
      status = event.multiValueQueryStringParameters.status
    }
  }
  const filters = ProjectFilter.create({ active, status })

  const token = event.headers.infotoken


  if (token === undefined) {
    return formatJSONResponse({ body: 'Não autenticado!' }, 401)
  }

  const response = await findAllProjectController.handle(filters, token)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getProjects = middyfy(getProjectsHandler)
