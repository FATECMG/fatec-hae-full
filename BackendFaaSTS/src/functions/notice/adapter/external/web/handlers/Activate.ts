import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type ActivateController } from '@common/domain/Controllers'

import { noticeContainer } from '@functions/notice/shared/Di.container'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'
import { type Notice } from '@functions/notice/entities'

const controller = noticeContainer.get<ActivateController<Notice>>(NoticeControllerLocator.NoticeActivateController)
const activateNoticeHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
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

export const activateNotice = middyfy(activateNoticeHandler)
