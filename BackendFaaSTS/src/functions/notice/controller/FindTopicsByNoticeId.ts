import { FindOneUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindOneController } from '@common/domain/Controllers'

import { type NoticeTopicsOfInterest, type NoticeTopicsOfInterestPM } from '@functions/notice/entities'
import { NoticeMapperLocator, NoticeUseCaseLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class FindOneNoticeTopicOfInterestsController extends FindOneController<NoticeTopicsOfInterest, NoticeTopicsOfInterestPM> {
  constructor (
    @inject(NoticeUseCaseLocator.NoticeFindTopicsByNoticeIdUseCase) readonly findOneUseCase: FindOneUseCase<NoticeTopicsOfInterest>,
    @inject(NoticeMapperLocator.NoticeTopicsOfInterestPMMapper) readonly PMFromEntity: Mapper<NoticeTopicsOfInterest, NoticeTopicsOfInterestPM>
  ) {
    super(PMFromEntity, findOneUseCase)
  }
}
