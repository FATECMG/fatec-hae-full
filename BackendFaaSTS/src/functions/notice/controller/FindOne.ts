import { FindOneUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindOneController } from '@common/domain/Controllers'

import { type Notice, type NoticePM } from '@functions/notice/entities'
import { NoticeMapperLocator, NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindOneNoticeController extends FindOneController<Notice, NoticePM> {
  constructor (
    @inject(NoticeUseCaseLocator.NoticeFindOneUseCase) readonly findOneUseCase: FindOneUseCase<Notice>,
    @inject(NoticeMapperLocator.NoticePresentationModelMapper) readonly PMFromEntity: Mapper<Notice, NoticePM>
  ) {
    super(PMFromEntity, findOneUseCase)
  }
}
