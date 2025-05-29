import { type DeactivateController } from '@common/domain/Controllers'
import { type HttpResponse } from '@common/http/Types'

import { type Notice } from '@functions/notice/entities'
import { NoticeControllerLocator } from '@functions/notice/shared/Di.enums'

import { NoticeDependencies } from '@libs/Inversify'

const deactivateController = NoticeDependencies.get<DeactivateController<Notice>>(NoticeControllerLocator.NoticeDeactivateController)

export const PatchDeactivateNoticeHandler = async (id?: string): Promise<HttpResponse<string>> => {
  if (id === undefined) {
    return { data: 'Invalid path id!', statusCode: 404 }
  }
  const response = await deactivateController.handle(id)
  return { data: response.data, statusCode: response.statusCode }
}
