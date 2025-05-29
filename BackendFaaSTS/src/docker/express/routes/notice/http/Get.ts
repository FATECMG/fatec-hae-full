import { type FindOneController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Notice, type NoticePM } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const getController = NoticeDependencies.get<FindOneController<Notice, NoticePM>>(NoticeControllerLocator.NoticeFindOneController)

export const GetNoticeHandler = async (id?: string): Promise<HttpResponse<string | NoticePM>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await getController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
