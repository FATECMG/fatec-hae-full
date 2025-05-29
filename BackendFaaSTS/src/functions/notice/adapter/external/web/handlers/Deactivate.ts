import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type DeactivateController } from '@common/domain/Controllers'

import { type Notice } from '@functions/notice/entities'
import { noticeContainer } from '@functions/notice/shared/Di.container'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

const controller = noticeContainer.get<DeactivateController<Notice>>(NoticeControllerLocator.NoticeDeactivateController)
const deactivateNoticeHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
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

export const deactivateNotice = middyfy(deactivateNoticeHandler)
