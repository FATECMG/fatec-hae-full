import 'reflect-metadata'
import { Container } from 'inversify'

import {
  type ActivateController,
  type DeactivateController,
  type DeleteController,
  type FindAllController,
  type FindOneController,
  type SaveController,
  type UpdateController
} from '@common/domain/Controllers'
import {
  type ValidateNoticeDate,
  type ActivateUseCase,
  type DeactivateUseCase,
  type DeleteUseCase,
  type FindAllUseCase,
  type FindOneUseCase,
  type SaveUseCase,
  type UpdateUseCase
} from '@common/domain/UseCase.interface'
import {
  type ActivateEntityRepository,
  type DeactivateEntityRepository,
  type DeleteEntityRepository,
  type FindAllEntityRepository,
  type FindOneEntityRepository,
  type SaveEntityRepository,
  type UpdateEntityRepository
} from '@common/repository/RepositoryInterface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'

import {
  type Notice,
  type NoticeDTO,
  type NoticePM,
  type NoticeTitleAndIdPM,
  type NoticeTitleAndId,
  type NoticeTopicsOfInterestPM,
  type NoticeTopicsOfInterest
} from '@functions/notice/entities'
import {
  SaveNoticeMongoRepository,
  UpdateNoticeMongoRepository,
  FindOneNoticeMongoRepository,
  FindAllNoticeMongoRepository,
  DeleteNoticeMongoRepository,
  ActivateNoticeMongoRepository,
  DeactivateNoticeMongoRepository,
  FindTopicsByNoticeIdMongoRepository,
  FindAllNoticeTitleAndIdMongoRepository
} from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'
import {
  NoticeMapper,
  NoticePresentationModelMapper,
  NoticeTitleAndIdMapper,
  NoticeTopicsOfInterestPMMapper
} from '@functions/notice/adapter/mapper'
import {
  ActivateNoticeUseCase,
  DeactivateNoticeUseCase,
  DeleteNoticeUseCase,
  FindAllNoticeTitleAndIdUseCase,
  FindAllNoticeUseCase,
  FindOneNoticeUseCase,
  FindTopicsByNoticeIdUseCase,
  SaveNoticeUseCase,
  UpdateNoticeUseCase,
  ValidateNoticeDateUseCase
} from '@functions/notice/useCases/UseCases'
import NoticeDTOZodValidation from '@functions/notice/adapter/validation/NoticeZodValidation'
import {
  ActivateNoticeController,
  DeactivateNoticeController,
  DeleteNoticeController,
  FindAllNoticeController,
  FindAllNoticeTitleAndIdController,
  FindOneNoticeController,
  FindTopicsByNoticeIdController,
  SaveNoticeController,
  UpdateNoticeController
} from '@functions/notice/controller/Controllers'
import {
  NoticeRepositoryLocator,
  NoticeMapperLocator,
  NoticeUseCaseLocator,
  NoticeValidatorLocator,
  NoticeControllerLocator
} from '@functions/notice/shared/Di.enums'

export const noticeContainer = new Container()

noticeContainer
  .bind<SaveEntityRepository<Notice>>(NoticeRepositoryLocator.NoticeSaveRepository)
  .to(SaveNoticeMongoRepository)

noticeContainer
  .bind<Mapper<NoticeDTO, Notice>>(NoticeMapperLocator.NoticeMapper)
  .to(NoticeMapper)

noticeContainer
  .bind<Mapper<Notice, NoticePM>>(NoticeMapperLocator.NoticePresentationModelMapper)
  .to(NoticePresentationModelMapper)

noticeContainer
  .bind<SaveUseCase<Notice>>(NoticeUseCaseLocator.NoticeSaveUseCase)
  .to(SaveNoticeUseCase)

noticeContainer
  .bind<NewValidationSchema>(NoticeValidatorLocator.NoticeDTOSchemaValidation)
  .to(NoticeDTOZodValidation)

noticeContainer
  .bind<SaveController< NoticeDTO, Notice, NoticePM>>(NoticeControllerLocator.NoticeSaveController)
  .to(SaveNoticeController)

noticeContainer
  .bind<UpdateEntityRepository<Notice>>(NoticeRepositoryLocator.NoticeUpdateRepository)
  .to(UpdateNoticeMongoRepository)

noticeContainer
  .bind<UpdateUseCase<Notice>>(NoticeUseCaseLocator.NoticeUpdateUseCase)
  .to(UpdateNoticeUseCase)

noticeContainer
  .bind<UpdateController< NoticeDTO, Notice, NoticePM>>(NoticeControllerLocator.NoticeUpdateController)
  .to(UpdateNoticeController)

noticeContainer
  .bind<FindOneEntityRepository<Notice>>(NoticeRepositoryLocator.NoticeFindOneRepository)
  .to(FindOneNoticeMongoRepository)

noticeContainer
  .bind<FindOneUseCase<Notice>>(NoticeUseCaseLocator.NoticeFindOneUseCase)
  .to(FindOneNoticeUseCase)

noticeContainer
  .bind<FindOneController<Notice, NoticePM>>(NoticeControllerLocator.NoticeFindOneController)
  .to(FindOneNoticeController)

noticeContainer
  .bind<FindAllEntityRepository<Notice>>(NoticeRepositoryLocator.NoticeFindAllRepository)
  .to(FindAllNoticeMongoRepository)

noticeContainer
  .bind<FindAllUseCase<Notice>>(NoticeUseCaseLocator.NoticeFindAllUseCase)
  .to(FindAllNoticeUseCase)

noticeContainer
  .bind<FindAllNoticeController>(NoticeControllerLocator.NoticeFindAllController)
  .to(FindAllNoticeController)

noticeContainer
  .bind<DeleteEntityRepository>(NoticeRepositoryLocator.NoticeDeleteRepository)
  .to(DeleteNoticeMongoRepository)

noticeContainer
  .bind<DeleteUseCase>(NoticeUseCaseLocator.NoticeDeleteUseCase)
  .to(DeleteNoticeUseCase)

noticeContainer
  .bind<DeleteController>(NoticeControllerLocator.NoticeDeleteController)
  .to(DeleteNoticeController)

noticeContainer
  .bind<ActivateEntityRepository<Notice>>(NoticeRepositoryLocator.NoticeActivateRepository)
  .to(ActivateNoticeMongoRepository)

noticeContainer
  .bind<ActivateUseCase<Notice>>(NoticeUseCaseLocator.NoticeActivateUseCase)
  .to(ActivateNoticeUseCase)

noticeContainer
  .bind<ActivateController<Notice>>(NoticeControllerLocator.NoticeActivateController)
  .to(ActivateNoticeController)

noticeContainer
  .bind<DeactivateEntityRepository<Notice>>(NoticeRepositoryLocator.NoticeDeactivateRepository)
  .to(DeactivateNoticeMongoRepository)

noticeContainer
  .bind<DeactivateUseCase<Notice>>(NoticeUseCaseLocator.NoticeDeactivateUseCase)
  .to(DeactivateNoticeUseCase)

noticeContainer
  .bind<DeactivateController<Notice>>(NoticeControllerLocator.NoticeDeactivateController)
  .to(DeactivateNoticeController)

noticeContainer

  .bind<FindOneEntityRepository<NoticeTopicsOfInterest>>(NoticeRepositoryLocator.NoticeFindTopicsByNoticeIdRepository)
  .to(FindTopicsByNoticeIdMongoRepository)

noticeContainer
  .bind<FindOneUseCase<NoticeTopicsOfInterest>>(NoticeUseCaseLocator.NoticeFindTopicsByNoticeIdUseCase)
  .to(FindTopicsByNoticeIdUseCase)

noticeContainer
  .bind<Mapper<NoticeTopicsOfInterest, NoticeTopicsOfInterestPM>>(NoticeMapperLocator.NoticeTopicsOfInterestPMMapper)
  .to(NoticeTopicsOfInterestPMMapper)

noticeContainer
  .bind<FindOneController<NoticeTopicsOfInterest, NoticeTopicsOfInterestPM>>(NoticeControllerLocator.NoticeFindTopicsByNoticeIdController)
  .to(FindTopicsByNoticeIdController)

noticeContainer
  .bind<FindAllEntityRepository<NoticeTitleAndId>>(NoticeRepositoryLocator.NoticeFindTitleAndIdRepository)
  .to(FindAllNoticeTitleAndIdMongoRepository)

noticeContainer
  .bind<FindAllUseCase<NoticeTitleAndId>>(NoticeUseCaseLocator.NoticeFindTitleAndIdUseCase)
  .to(FindAllNoticeTitleAndIdUseCase)

noticeContainer
  .bind<FindAllController<NoticeTitleAndId, NoticeTitleAndIdPM>>(NoticeControllerLocator.NoticeFindTitleAndIdController)
  .to(FindAllNoticeTitleAndIdController)

noticeContainer
  .bind<Mapper<NoticeTitleAndId, NoticeTitleAndIdPM>>(NoticeMapperLocator.NoticeTitleAndIdMapper)
  .to(NoticeTitleAndIdMapper)

noticeContainer
  .bind<ValidateNoticeDate>(NoticeUseCaseLocator.NoticeValidateDateUseCase)
  .to(ValidateNoticeDateUseCase)
