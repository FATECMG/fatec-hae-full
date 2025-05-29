import { type FindOneController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type NoticeTopicsOfInterest, type NoticeTopicsOfInterestPM } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const getController = NoticeDependencies
  .get<FindOneController<NoticeTopicsOfInterest, NoticeTopicsOfInterestPM>>(NoticeControllerLocator.NoticeFindTopicsByNoticeIdController)

export const GetNoticeTopicsOfInterestHandler = async (id?: string): Promise<HttpResponse<string | NoticeTopicsOfInterestPM>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
