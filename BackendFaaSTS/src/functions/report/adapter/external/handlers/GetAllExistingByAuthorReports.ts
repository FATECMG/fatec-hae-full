import { ReportDependencies } from '@libs/Inversify'
import { ReportControllerLocator } from '@functions/report/shared/Di.enums'

import { middyfy } from '@libs/Lambda'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { type FindAllExistingByAuthorReportsController } from '@functions/report/controller/FindAllExistingByAuthorReportsController'

const findAllReportsByAuthorController = ReportDependencies.get<FindAllExistingByAuthorReportsController>(ReportControllerLocator.FindAllExistingByAuthorReportsController)

const getAllReportsHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const token = event.headers.infotoken

  if (token === undefined) {
    return formatJSONResponse({ body: 'Não autenticado!' }, 401)
  }

  const response = await findAllReportsByAuthorController.handle(token)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getAllReports = middyfy(getAllReportsHandler)
