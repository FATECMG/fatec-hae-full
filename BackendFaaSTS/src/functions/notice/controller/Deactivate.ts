import { DeactivateController } from '@common/domain/Controllers'
import { DeactivateUseCase } from '@common/domain/UseCase.interface'

import { type Notice } from '@functions/notice/entities'
import { NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class DeactivateNoticeController extends DeactivateController<Notice> {
  constructor (
  @inject(NoticeUseCaseLocator.NoticeDeactivateUseCase) deactivateUseCase: DeactivateUseCase<Notice>
  ) {
    super(deactivateUseCase)
  }
}
