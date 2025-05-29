import { type UpdateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError } from '@common/error/ValidationError'

import { type Notice, type NoticeDTO, type NoticePM } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const putController = NoticeDependencies.get<UpdateController<NoticeDTO, Notice, NoticePM>>(NoticeControllerLocator.NoticeUpdateController)

export const PutProjectHandler = async (req: any, id?: string): Promise<HttpResponse<string | NoticePM | FieldError | FieldError[]>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
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
  const response = await putController.handle(param, id)
  return { data: response.data, statusCode: response.statusCode }
}
