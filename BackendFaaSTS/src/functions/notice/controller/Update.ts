import { UpdateController } from '@common/domain/Controllers'
import { Mapper } from '@common/mapper/BaseMapper'
import { NewValidationSchema } from '@common/validation/Validate'
import { UpdateUseCase } from '@common/domain/UseCase.interface'

import { type NoticeDTO, type Notice, type NoticePM } from '@functions/notice/entities'
import { NoticeUseCaseLocator, NoticeMapperLocator, NoticeValidatorLocator } from '@functions/notice/shared/Di.enums'

import { injectable, inject } from 'inversify'

@injectable()
export default class UpdateNoticeController extends UpdateController<NoticeDTO, Notice, NoticePM> {
  constructor (
  @inject(NoticeValidatorLocator.NoticeDTOSchemaValidation) dtoValidator: NewValidationSchema,
    @inject(NoticeMapperLocator.NoticeMapper) toEntity: Mapper<NoticeDTO, Notice>,
    @inject(NoticeMapperLocator.NoticePresentationModelMapper) toPresentationModel: Mapper<Notice, NoticePM>,
    @inject(NoticeUseCaseLocator.NoticeUpdateUseCase) update: UpdateUseCase<Notice>
  ) {
    super(dtoValidator, toEntity, toPresentationModel, update)
  }
}
