import { type ReportDeleteSchema} from '../Schema'

import { ReportDependencies } from '@libs/Inversify'
import { ReportControllerLocator } from '@functions/report/shared/Di.enums'

import { middyfy } from '@libs/Lambda'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { type HandleDeleteReportController } from '@functions/report/controller/DeleteReportControlller'

const deleteReportController = ReportDependencies.get<HandleDeleteReportController>(ReportControllerLocator.DeleteReportController)

const deleteReportHandler: ValidatedEventAPIGatewayProxyEvent<typeof ReportDeleteSchema> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const token = event.headers.infotoken

  if (token === undefined) {
    return formatJSONResponse({ body: 'Não autenticado!' }, 401)
  }

  const id = event?.pathParameters?.id
      if (id === undefined) {
        return formatJSONResponse({
          body: 'Invalid path id!'
        }, 404)
      }

  const response = await deleteReportController.handle(id)

  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const deleteReport = middyfy(deleteReportHandler)
