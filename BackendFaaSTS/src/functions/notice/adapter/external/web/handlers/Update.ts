import { middyfy } from '@libs/Lambda'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'

import { type UpdateController } from '@common/domain/Controllers'

import { type Notice, type NoticeDTO, type NoticePM } from '@functions/notice/entities'
import { noticeContainer } from '@functions/notice/shared/Di.container'
import type NoticeSchema from '@functions/notice/adapter/external/web/NoticeSchema'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

const controller = noticeContainer.get<UpdateController<NoticeDTO, Notice, NoticePM>>(NoticeControllerLocator.NoticeUpdateController)
const updateNoticeHandler: ValidatedEventAPIGatewayProxyEvent<typeof NoticeSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const id = event?.pathParameters?.id
      const request = event.body

      if (id === undefined) {
        return formatJSONResponse({
          body: 'Invalid path id!'
        }, 404)
      }

      const param: NoticeDTO = {
        title: request.title,
        description: request.description,
        topicsOfInterest: request.topicsOfInterest,
        semester: request.semester,
        year: request.year,
        openDate: request.openDate,
        closeDate: request.closeDate,
        evaluationEndDate: request.evaluationEndDate,
        active: request.active
      }
      const response = await controller.handle(param, id)
      return formatJSONResponse({
        body: response.data
      }, response.statusCode)
    }

export const putNotice = middyfy(updateNoticeHandler)
