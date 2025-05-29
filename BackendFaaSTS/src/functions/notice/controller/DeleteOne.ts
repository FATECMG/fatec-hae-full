import { DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteController } from '@common/domain/Controllers'

import { NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class DeleteNoticeController extends DeleteController {
  constructor (
    @inject(NoticeUseCaseLocator.NoticeDeleteUseCase) readonly deleteUseCase: DeleteUseCase
  ) {
    super(deleteUseCase)
  }
}
