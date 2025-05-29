import { type ActivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Notice } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const activateController = NoticeDependencies.get<ActivateController<Notice>>(NoticeControllerLocator.NoticeActivateController)

export const PatchActivateNoticeHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await activateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
