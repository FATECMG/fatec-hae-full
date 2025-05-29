import { NoticeDependencies } from '@libs/Inversify'

import { type SaveController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type Notice, type NoticeDTO, type NoticePM } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

const saveController = NoticeDependencies.get<SaveController<NoticeDTO, Notice, NoticePM>>(NoticeControllerLocator.NoticeSaveController)

export const PostNoticeHandler = async (req: any): Promise<HttpResponse<string | NoticePM | FieldError | FieldError[]>> => {
  const request = req.body
  const param: NoticeDTO = {
    title: request.title,
    description: request.description,
    topicsOfInterest: request.topicsOfInterest,
    semester: request.semester,
    year: request.year,
    openDate: request.openDate,
    closeDate: request.closeDate,
    evaluationEndDate: request.evaluationEndDate,
    course: request.course,
    active: request.active
  }
  const response = await saveController.handle(param)
  return { data: response.data, statusCode: response.statusCode }
}
