import { type FindAllController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Notice, type NoticePM } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const getController = NoticeDependencies.get<FindAllController<Notice, NoticePM>>(NoticeControllerLocator.NoticeFindAllController)

export const GetAllNoticeHandler = async (activeParam?: string): Promise<HttpResponse<NoticePM[]>> => {
  let active: boolean = true
  if (activeParam !== undefined) {
    active = activeParam !== 'false'
  }
  const response = await getController.handle(active)
  return { data: response.data, statusCode: response.statusCode }
}
