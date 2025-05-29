import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { ReportDependencies } from '@libs/Inversify'
import { type ReportStatusUpdateSchema } from '@functions/report/adapter/external/Schema'
import { UpdateReportStatusController } from '@functions/report/controller/UpdateReportStatus'
import { ReportControllerLocator } from '@functions/report/shared/Di.enums'

import middy from '@middy/core'

const updateReportStatusController = ReportDependencies
    .get<UpdateReportStatusController>(ReportControllerLocator.UpdateStatusController)

const updateReportStatusHandler: ValidatedEventAPIGatewayProxyEvent<typeof ReportStatusUpdateSchema> = async (event, context) => {
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

  const response = await updateReportStatusController.handle(id, status, token)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const patchStatusReport = middy(updateReportStatusHandler)
