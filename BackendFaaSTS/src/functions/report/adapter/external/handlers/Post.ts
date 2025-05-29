import { ReportDTO } from '@functions/report/entities/dto/ReportDTO'

import type Schema from '../Schema'

import { ReportDependencies } from '@libs/Inversify'
import { ReportControllerLocator } from '@functions/report/shared/Di.enums'

import { middyfy } from '@libs/Lambda'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { type HandleSaveReportController } from '@functions/report/controller/Create'

const saveReportController = ReportDependencies.get<HandleSaveReportController>(ReportControllerLocator.SaveReportController)

const postReportHandler: ValidatedEventAPIGatewayProxyEvent<typeof Schema> = async (event, context) => {
  const request = event.body
  context.callbackWaitsForEmptyEventLoop = false
  const param = new ReportDTO({
    activities: request.activities,
    projectId: request.projectId
  })

  const token = event.headers.infotoken

  if (token === undefined) {
    return formatJSONResponse({ body: 'Não autenticado!' }, 401)
  }

  const response = await saveReportController.handle(param, token)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const postReport = middyfy(postReportHandler)
