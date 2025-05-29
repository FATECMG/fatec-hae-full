export const NoticeMapperLocator = {
  NoticeMapper: Symbol.for('NoticeMapper'),
  NoticePresentationModelMapper: Symbol.for('NoticePresentationModelMapper'),
  NoticeTopicsOfInterestPMMapper: Symbol.for('NoticeTopicsOfInterestPMMapper'),
  NoticeTitleAndIdMapper: Symbol.for('NoticeTitleAndIdMapper')
}
export const NoticeRepositoryLocator = {
  NoticeSaveRepository: Symbol.for('NoticeSaveRepository'),
  NoticeUpdateRepository: Symbol.for('NoticeUpdateRepository'),
  NoticeFindOneRepository: Symbol.for('NoticeFindOneRepository'),
  NoticeFindAllRepository: Symbol.for('NoticeFindAllRepository'),
  NoticeDeleteRepository: Symbol.for('NoticeDeleteRepository'),
  NoticeActivateRepository: Symbol.for('NoticeActivateRepository'),
  NoticeDeactivateRepository: Symbol.for('NoticeDeactivateRepository'),
  NoticeFindTopicsByNoticeIdRepository: Symbol.for('NoticeFindTopicsByNoticeIdRepository'),
  NoticeFindTitleAndIdRepository: Symbol.for('NoticeFindTitleAndIdRepository')
}
export const NoticeUseCaseLocator = {
  NoticeSaveUseCase: Symbol.for('NoticeSaveUseCase'),
  NoticeUpdateUseCase: Symbol.for('NoticeUpdateUseCase'),
  NoticeFindOneUseCase: Symbol.for('NoticeFindOneUseCase'),
  NoticeFindAllUseCase: Symbol.for('NoticeFindAllUseCase'),
  NoticeDeleteUseCase: Symbol.for('NoticeDeleteUseCase'),
  NoticeActivateUseCase: Symbol.for('NoticeActivateUseCase'),
  NoticeDeactivateUseCase: Symbol.for('NoticeDeactivateUseCase'),
  NoticeFindTopicsByNoticeIdUseCase: Symbol.for('NoticeFindTopicsByNoticeIdUseCase'),
  NoticeFindTitleAndIdUseCase: Symbol.for('NoticeFindTitleAndIdUseCase'),
  NoticeValidateDateUseCase: Symbol.for('NoticeValidateDateUseCase')
}
export const NoticeValidatorLocator = {
  NoticeDTOSchemaValidation: Symbol.for('NoticeDTOSchemaValidation')
}
export const NoticeControllerLocator = {
  NoticeSaveController: Symbol.for('NoticeSaveController'),
  NoticeUpdateController: Symbol.for('NoticeUpdateController'),
  NoticeFindOneController: Symbol.for('NoticeFindOneController'),
  NoticeFindAllController: Symbol.for('NoticeFindAllController'),
  NoticeDeleteController: Symbol.for('NoticeDeleteController'),
  NoticeActivateController: Symbol.for('NoticeActivateController'),
  NoticeDeactivateController: Symbol.for('NoticeDeactivateController'),
  NoticeFindTopicsByNoticeIdController: Symbol.for('NoticeFindTopicsByNoticeIdController'),
  NoticeFindTitleAndIdController: Symbol.for('NoticeFindTitleAndIdController')
}
