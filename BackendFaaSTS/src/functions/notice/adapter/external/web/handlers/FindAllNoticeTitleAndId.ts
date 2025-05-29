import { formatJSONResponse, type ValidatedEventAPIGatewayProxyEvent } from '@libs/ApiGateway'
import { middyfy } from '@libs/Lambda'

import { type FindAllController } from '@common/domain/Controllers'

import { type Notice, type NoticeTitleAndIdPM } from '@functions/notice/entities'
import { noticeContainer } from '@functions/notice/shared/Di.container'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

const controller = noticeContainer.get<FindAllController<Notice, NoticeTitleAndIdPM>>(NoticeControllerLocator.NoticeFindTitleAndIdController)
const getNoticesTitleAndIdHandler: ValidatedEventAPIGatewayProxyEvent<any> = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  let active: boolean = true
  if (event?.queryStringParameters !== null && event.queryStringParameters.active !== undefined) {
    active = event.queryStringParameters.active !== 'false'
  }
  const response = await controller.handle(active)
  return formatJSONResponse({ body: response.data }, response.statusCode)
}

export const getNoticesTitleAndId = middyfy(getNoticesTitleAndIdHandler)
