import { type HandleUpdateProjectStatusController } from '@functions/project/controller/UpdateProjectStatus'
import { ProjectControllerLocator } from '@functions/project/shared/Di.enums'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { ProjectDependencies } from '@libs/Inversify'
import middy from '@middy/core'
import { type ProjectStatusUpdateSchema } from '@functions/project/adapter/external/web/Schema'

const updateProjectStatusController = ProjectDependencies.get<HandleUpdateProjectStatusController>(ProjectControllerLocator.UpdateProjectStatusController)
const changeProjectStatusHandler: ValidatedEventAPIGatewayProxyEvent<typeof ProjectStatusUpdateSchema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event.pathParameters?.id
  const request = JSON.parse(event.body)
  const status = request.status
  const token = event.headers?.infotoken

  if (request === undefined) {
    return formatJSONResponse({
      body: 'Status is required!'
    }, 404)
  }

  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }

  if (token === undefined || token === '') {
    return formatJSONResponse({
      body: 'Not Authenticated!'
    }, 401)
  }

  const response = await updateProjectStatusController.handle(id, status, token)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const patchStatusProject = middy(changeProjectStatusHandler)
