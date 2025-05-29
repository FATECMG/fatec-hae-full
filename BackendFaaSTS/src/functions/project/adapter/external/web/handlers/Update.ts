import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'
import { ProjectDependencies } from '@libs/Inversify'

import { type ProjectPutSchema } from '@functions/project/adapter/external/web/Schema'
import { ProjectUpdateDTO } from '@functions/project/entities/dto/ProjectUpdateDTO'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { type HandleUpdateProjectController } from '@functions/project/controller/Update'

const putProjectController = ProjectDependencies.get<HandleUpdateProjectController>(ProjectControllerLocator.UpdateProjectController)
const putProjectHandler: ValidatedEventAPIGatewayProxyEvent<typeof ProjectPutSchema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  const request = event.body

  const token = event.headers.infotoken

  if (token === undefined) {
    return formatJSONResponse({ body: 'Não autenticado!' }, 401)
  }

  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const param = new ProjectUpdateDTO({
    author: request.author,
    title: request.title,
    notice: request.notice,
    description: request.description,
    complianceModel: request.complianceModel,
    hours: request.hours,
    justification: request.justification,
    references: request.references,
    methodology: request.methodology,
    objectives: request.objectives,
    schedule: request.schedule,
    status: request.status,
    topicsOfInterest: request.topicsOfInterest,
    active: request.active
  })
  const response = await putProjectController.handle(param, id, token)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const putProject = middyfy(putProjectHandler)
