import { Container } from 'inversify'
import { ReportControllerLocator, ReportMapperLocator, ReportRepositoryLocator, ReportSchemaValidationLocator, ReportUseCaseLocator } from './Di.enums'
import { SaveReportRepository } from '../adapter/repositories/mongodb/SaveEntity'
import { type CreateReportUseCaseProps, SaveReportUseCase } from '../usecases/Create'
import { CreateReportDTOZodValidation } from '../adapter/validation/ZodReportDTOValidation'
import { ReportPresentationModelMapper } from '../adapter/mapper/ReportPMMapper'
import { HandleSaveReportController } from '../controller/Create'
import { FindAllExistingNonDraftReportsRepository } from '../adapter/repositories/mongodb/FindAllExistingNonDraftReports'
import { FindAllExistingNonDraftReportsUseCase } from '../usecases/FindAllExistingNonDraftReports'
import { FindAllExistingNonDraftReportsController } from '../controller/FindAllExistingNonDraftReportsController'
import { FindAllExistingByAuthorReportsController } from '../controller/FindAllExistingByAuthorReportsController'
import { type DeleteEntityRepository, type FindOneEntityRepository, type FindAllEntityRepository, type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { type DeleteUseCase, type UpdateStatusUseCase, type FindAllUseCase, type SaveUseCaseFromInterface } from '@common/domain/UseCase.interface'
import { type Report } from '../entities/Report'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type ReportPM } from '../entities/pm/ReportPM'
import FindOneReportMongoRepository from '@functions/report/adapter/repositories/mongodb/FindOneReportById'
import { UpdateStatusRepository } from '../adapter/repositories/mongodb/UpdateStatusRepository'
import { UpdateReportStatusUseCase } from '../usecases/UpdateReportStatusUseCase'
import { type UpdateStatusController } from '@common/domain/Controllers'
import { UpdateReportStatusController } from '../controller/UpdateReportStatus'
import { FindOneReportByProjectIdRepository } from '../adapter/repositories/mongodb/FindOneReportByProjectId'
import { FindAllExistingByAuthorReportsUseCase } from '../usecases/FindAllExistingByAuthorReportsUseCase'
import { FindAllExistingByAuthorReportsRepository } from '../adapter/repositories/mongodb/FindAllExistingByAuthorReports'
import { HandleDeleteReportController } from '../controller/DeleteReportControlller'
import { DeleteReportRepository } from '../adapter/repositories/mongodb/DeleteReportRepository'
import { DeleteReportUseCase } from '../usecases/DeleteReportUseCase'
import { HandleUpdateReportController } from '../controller/UpdateReportController'

export const reportContainer = new Container()

reportContainer
  .bind<SaveEntityRepository<Report>>(ReportRepositoryLocator.SaveReportRepository)
  .to(SaveReportRepository)

reportContainer
  .bind<SaveUseCaseFromInterface<Report, CreateReportUseCaseProps>>(ReportUseCaseLocator.SaveReportUseCase)
  .to(SaveReportUseCase)

reportContainer
  .bind<NewValidationSchema>(ReportSchemaValidationLocator.ReportDTONewValidationSchema)
  .to(CreateReportDTOZodValidation)

reportContainer
  .bind<Mapper<Report, ReportPM>>(ReportMapperLocator.ReportPresentationModelMapper)
  .to(ReportPresentationModelMapper)

reportContainer
  .bind<HandleSaveReportController>(ReportControllerLocator.SaveReportController)
  .to(HandleSaveReportController)

reportContainer
  .bind<FindAllEntityRepository<Report>>(ReportRepositoryLocator.FindAllExistingNonDraftReportsRepository)
  .to(FindAllExistingNonDraftReportsRepository)

reportContainer
  .bind<FindAllEntityRepository<Report>>(ReportRepositoryLocator.FindAllExistingByAuthorReportsRepository)
  .to(FindAllExistingByAuthorReportsRepository)

reportContainer
  .bind<FindAllUseCase<Report>>(ReportUseCaseLocator.FindAllExistingNonDraftReportsUseCase)
  .to(FindAllExistingNonDraftReportsUseCase)

reportContainer
  .bind<FindAllUseCase<Report>>(ReportUseCaseLocator.FindAllExistingByAuthorReportsUseCase)
  .to(FindAllExistingByAuthorReportsUseCase)

reportContainer
  .bind<FindAllExistingNonDraftReportsController>(ReportControllerLocator.FindAllExistingNonDraftReportsController)
  .to(FindAllExistingNonDraftReportsController)

reportContainer
  .bind<FindAllExistingByAuthorReportsController>(ReportControllerLocator.FindAllExistingByAuthorReportsController)
  .to(FindAllExistingByAuthorReportsController)

reportContainer
  .bind<FindOneEntityRepository<Report>>(ReportRepositoryLocator.FindOneReportByIdRepository)
  .to(FindOneReportMongoRepository)

reportContainer
  .bind<UpdateStatusRepository>(ReportRepositoryLocator.UpdateStatusRepository)
  .to(UpdateStatusRepository)

reportContainer
  .bind<UpdateStatusUseCase<Report>>(ReportUseCaseLocator.UpdateStatusUseCase)
  .to(UpdateReportStatusUseCase)

reportContainer
  .bind<UpdateStatusController<Report, ReportPM>>(ReportControllerLocator.UpdateStatusController)
  .to(UpdateReportStatusController)

reportContainer
  .bind<FindOneReportByProjectIdRepository>(ReportRepositoryLocator.FindOneReportByProjectIdRepository)
  .to(FindOneReportByProjectIdRepository)

reportContainer
  .bind<HandleDeleteReportController>(ReportControllerLocator.DeleteReportController)
  .to(HandleDeleteReportController)

reportContainer
  .bind<DeleteEntityRepository>(ReportRepositoryLocator.DeleteReportRepository)
  .to(DeleteReportRepository)

reportContainer.bind<DeleteUseCase>(ReportUseCaseLocator.DeleteReportUseCase).to(DeleteReportUseCase)

reportContainer.bind<HandleUpdateReportController>(ReportControllerLocator.UpdateReportController).to(HandleUpdateReportController)
