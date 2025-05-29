import { SaveController } from '@common/domain/Controllers'
import { Mapper } from '@common/mapper/BaseMapper'
import { SaveUseCase } from '@common/domain/UseCase.interface'
import { NewValidationSchema } from '@common/validation/Validate'

import { type Notice, type NoticeDTO, type NoticePM } from '@functions/notice/entities'
import { NoticeUseCaseLocator, NoticeMapperLocator, NoticeValidatorLocator } from '@functions/notice/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export default class SaveNoticeController extends SaveController<NoticeDTO, Notice, NoticePM> {
  constructor (
  @inject(NoticeValidatorLocator.NoticeDTOSchemaValidation) dtoValidator: NewValidationSchema,
    @inject(NoticeMapperLocator.NoticeMapper) toEntity: Mapper<NoticeDTO, Notice>,
    @inject(NoticeMapperLocator.NoticePresentationModelMapper) toPresentationModel: Mapper<Notice, NoticePM>,
    @inject(NoticeUseCaseLocator.NoticeSaveUseCase) save: SaveUseCase<Notice>
  ) {
    super(dtoValidator, toEntity, toPresentationModel, save)
  }
}
