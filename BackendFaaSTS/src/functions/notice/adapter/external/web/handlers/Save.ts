import { middyfy } from '@libs/Lambda'
import { NoticeDependencies } from '@libs/Inversify'
import { type ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/ApiGateway'

import { type SaveController } from '@common/domain/Controllers'

import { type Notice, type NoticeDTO, type NoticePM } from '@functions/notice/entities'
import type NoticeSchema from '@functions/notice/adapter/external/web/NoticeSchema'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

const controller = NoticeDependencies.get<SaveController<NoticeDTO, Notice, NoticePM>>(NoticeControllerLocator.NoticeSaveController)
const postNoticeHandler: ValidatedEventAPIGatewayProxyEvent<typeof NoticeSchema> =
    async (event, context) => {
      context.callbackWaitsForEmptyEventLoop = false
      const request = event.body

      let param: NoticeDTO = {
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

      const courseId = request.course?.id
      const courseName = request.course?.name

      if (courseId !== undefined && courseName !== undefined) {
        param = {
          ...param,
          course: {
            id: courseId,
            name: courseName
          }
        }
      }

      const response = await controller.handle(param)
      return formatJSONResponse({
        body: response.data
      }, response.statusCode)
    }

export const postNotice = middyfy(postNoticeHandler)
