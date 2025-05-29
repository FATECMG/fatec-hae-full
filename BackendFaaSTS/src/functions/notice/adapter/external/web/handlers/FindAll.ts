import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'
import FindAllNoticeController from '@functions/notice/controller/FindAll'
import { NoticeDependencies } from '@libs/Inversify'

const controller = NoticeDependencies.get<FindAllNoticeController>(NoticeControllerLocator.NoticeFindAllController)
const getNoticesHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  let active: boolean = true
  if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
    active = event.queryStringParameters.active !== 'false'
  }

  const token = event.headers.infotoken

  if (token === undefined) {
    return formatJSONResponse({ body: 'Não Autenticado!' }, 401)
  }

  const response = await controller.handle(token, active)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getNotices = middyfy(getNoticesHandler)
