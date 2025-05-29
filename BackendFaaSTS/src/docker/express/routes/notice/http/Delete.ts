import { type DeleteController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const deleteController = NoticeDependencies.get<DeleteController>(NoticeControllerLocator.NoticeDeleteController)

export const DeleteNoticeHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deleteController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
