import { FindAllController } from '@common/domain/Controllers'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllUseCase } from '@common/domain/UseCase.interface'

import { NoticeMapperLocator, NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'
import { type NoticeTitleAndId, type NoticeTitleAndIdPM } from '@functions/notice/entities'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindAllNoticeTitleAndIdController extends FindAllController<NoticeTitleAndId, NoticeTitleAndIdPM> {
  constructor (
    @inject(NoticeMapperLocator.NoticeTitleAndIdMapper) readonly PMFromEntity: Mapper<NoticeTitleAndId, NoticeTitleAndIdPM>,
    @inject(NoticeUseCaseLocator.NoticeFindTitleAndIdUseCase) readonly findAllUseCase: FindAllUseCase<NoticeTitleAndId>
  ) {
    super(PMFromEntity, findAllUseCase)
  }
}
