import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type FindOneController } from '@common/domain/Controllers'

import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'
import { noticeContainer } from '@functions/notice/shared/Di.container'
import { type Notice, type NoticePM } from '@functions/notice/entities'

const controller = noticeContainer.get<FindOneController<Notice, NoticePM>>(NoticeControllerLocator.NoticeFindOneController)
const getNoticeHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const id = event?.pathParameters?.id
  if (id === undefined) {
    return formatJSONResponse({
      body: 'Invalid path id!'
    }, 404)
  }
  const response = await controller.handle(id)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getNotice = middyfy(getNoticeHandler)
