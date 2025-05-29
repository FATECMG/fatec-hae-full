import { ActivateController } from '@common/domain/Controllers'
import { ActivateUseCase } from '@common/domain/UseCase.interface'

import { type Notice } from '@functions/notice/entities'
import { NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class ActivateNoticeController extends ActivateController<Notice> {
  constructor (
  @inject(NoticeUseCaseLocator.NoticeActivateUseCase) activateUseCase: ActivateUseCase<Notice>
  ) {
    super(activateUseCase)
  }
}
