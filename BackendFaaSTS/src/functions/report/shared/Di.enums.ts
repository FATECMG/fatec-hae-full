export const ReportRepositoryLocator = {
  SaveReportRepository: Symbol.for('saveReportRepository'),
  FindAllExistingNonDraftReportsRepository: Symbol.for('FindAllExistingNonDraftReportsRepository'),
  FindAllExistingByAuthorReportsRepository: Symbol.for('FindAllExistingByAuthorReportsRepository'),
  FindOneReportByIdRepository: Symbol.for('FindOneReportByIdRepository'),
  UpdateStatusRepository: Symbol.for('UpdateReportStatusRepository'),
  FindOneReportByProjectIdRepository: Symbol.for('FindOneReportByProjectIdRepository'),
  DeleteReportRepository: Symbol.for('DeleteReportRepository')
}

export const ReportUseCaseLocator = {
  SaveReportUseCase: Symbol.for('saveReportUseCase'),
  FindAllExistingNonDraftReportsUseCase: Symbol.for('FindAllExistingNonDraftReportsUseCase'),
  FindAllExistingByAuthorReportsUseCase: Symbol.for('FindAllExistingByAuthorReportsUseCase'),
  UpdateStatusUseCase: Symbol.for('UpdateStatusUseCase'),
  DeleteReportUseCase: Symbol.for('DeleteReportUseCase')
}

export const ReportSchemaValidationLocator = {
  ReportDTONewValidationSchema: Symbol.for('reportDTONewValidationSchema')
}

export const ReportMapperLocator = {
  ReportMapper: Symbol.for('reportMapper'),
  ReportPresentationModelMapper: Symbol.for('reportPresentationModelMapper')
}

export const ReportControllerLocator = {
  SaveReportController: Symbol.for('handleSaveReportController'),
  FindAllExistingByAuthorReportsController: Symbol.for('FindAllExistingByAuthorReportsController'),
  FindAllExistingNonDraftReportsController: Symbol.for('FindAllExistingNonDraftReportsController'),
  UpdateStatusController: Symbol.for('UpdateReportStatusController'),
  DeleteReportController: Symbol.for('HandleDeleteReportController'),
  UpdateReportController: Symbol.for('HandleUpdateReportController')
}
