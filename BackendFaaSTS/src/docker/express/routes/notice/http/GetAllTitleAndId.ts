import { type FindAllController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type NoticeTitleAndIdPM, type Notice } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const getController = NoticeDependencies.get<FindAllController<Notice, NoticeTitleAndIdPM>>(NoticeControllerLocator.NoticeFindTitleAndIdController)

export const GetAllNoticeTitleAndIdHandler = async (activeParam?: string): Promise<HttpResponse<NoticeTitleAndIdPM[]>> => {
  let active: boolean = true
  if (activeParam !== undefined) {
    active = activeParam !== 'false'
  }
  const response = await getController.handle(active)
  return { data: response.data, statusCode: response.statusCode }
}
