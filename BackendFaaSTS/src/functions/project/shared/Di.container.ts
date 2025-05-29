import 'reflect-metadata'
import { Container } from 'inversify'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import {
  type FindAllEntityWithFilterRepository,
  type ActivateEntityRepository,
  type DeactivateEntityRepository,
  type DeleteEntityRepository,
  type FindOneEntityRepository,
  type SaveEntityRepository,
  type UpdateEntityRepository,
  type FindAllFromEntityRepository
} from '@common/repository/RepositoryInterface'
import {
  type FindAllWithFilterUseCase,
  type ActivateUseCase,
  type DeactivateUseCase,
  type DeleteUseCase,
  type FindOneUseCase,
  type SaveUseCase,
  type UpdateUseCase,
  type FindAllFromEntityUseCase,
  UpdateStatusUseCase
} from '@common/domain/UseCase.interface'
import {
  type SaveController,
  type FindOneController,
  type DeleteController,
  type DeactivateController,
  type ActivateController,
  type FindAllFromEntityController,
  type UpdateStatusController
} from '@common/domain/Controllers'

import { ProjectControllerLocator, ProjectMapperLocator, ProjectRepositoryLocator, ProjectSchemaValidationLocator, ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'
import { SaveProjectRepository } from '@functions/project/adapter/repositories/MongoDB/saveEntity'
import { type ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'
import { type Project } from '@functions/project/entities/Project'
import { ProjectMapper, ProjectPresentationModelMapper, ProjectUpdateMapper } from '@functions/project/adapter/mapper/Project.mapper'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { SaveProjectUseCase } from '@functions/project/useCases/save'
import { HandleSaveProjectController } from '@functions/project/controller/save'
import { FindOneProjectUseCase } from '@functions/project/useCases/FindOne'
import { FindOneProjectRepository } from '@functions/project/adapter/repositories/MongoDB/FindOneEntity'
import { HandleFindOneProjectController } from '@functions/project/controller/FindOne'
import { FindAllProjectRepository } from '@functions/project/adapter/repositories/MongoDB/FindAll'
import { FindAllProjectUseCase } from '@functions/project/useCases/FindAll'
import { FindAllProjectController } from '@functions/project/controller/FindAll'
import { UpdateProjectRepository } from '@functions/project/adapter/repositories/MongoDB/UpdateEntity'
import { UpdateProjectUseCase } from '@functions/project/useCases/Update'
import { HandleUpdateProjectController } from '@functions/project/controller/Update'
import { DeleteProjectRepository } from '@functions/project/adapter/repositories/MongoDB/Delete'
import { DeleteProjectUseCase } from '@functions/project/useCases/Delete'
import { HandleDeleteProjectController } from '@functions/project/controller/Delete'
import ProjectDTOZodValidation from '@functions/project/adapter/validation/ProjectZodValidation'
import { DeactivateProjectUseCase } from '@functions/project/useCases/Deactivate'
import { HandleDeactivateProjectController } from '@functions/project/controller/Deactivate'
import { ActivateProjectUseCase } from '@functions/project/useCases/Activate'
import { HandleActivateProjectController } from '@functions/project/controller/Activate'
import { DeactivateProjectRepository } from '@functions/project/adapter/repositories/MongoDB/Deactivate'
import { ActivateProjectRepository } from '@functions/project/adapter/repositories/MongoDB/Activate'
import { type ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { type ProjectUpdateDTO } from '@functions/project/entities/dto/ProjectUpdateDTO'
import ProjectUpdateDTOZodValidation from '@functions/project/adapter/validation/ProjectUpdateZodValidation'
import { UpdateProjectStatusUseCase } from '@functions/project/useCases/UpdateStatus'
import { HandleUpdateProjectStatusController } from '@functions/project/controller/UpdateProjectStatus'
import { UpdateStatusRepository } from '@functions/project/adapter/repositories/MongoDB/UpdateStatus'
import { HandleFindAllProjectsFromUserController } from '@functions/project/controller/FindAllFromUser'
import { FindAllProjectFromUserUseCase } from '@functions/project/useCases/FindAllFromUser'
import { FindAllProjectFromUserIdRepository } from '@functions/project/adapter/repositories/MongoDB/FindAllFromUser'

export const projectContainer = new Container()

projectContainer
  .bind<Mapper<ProjectDTO, Project>>(ProjectMapperLocator.ProjectMapper)
  .to(ProjectMapper)

projectContainer
  .bind<Mapper<Project, ProjectPM>>(ProjectMapperLocator.ProjectPresentationModelMapper)
  .to(ProjectPresentationModelMapper)

projectContainer
  .bind<Mapper<ProjectUpdateDTO, Project>>(ProjectMapperLocator.ProjectUpdateMapper)
  .to(ProjectUpdateMapper)

projectContainer
  .bind<SaveEntityRepository<Project>>(ProjectRepositoryLocator.SaveProjectRepository)
  .to(SaveProjectRepository)

projectContainer
  .bind<SaveUseCase<Project>>(ProjectUseCaseLocator.SaveProjectUseCase)
  .to(SaveProjectUseCase)

projectContainer
  .bind<SaveController<ProjectDTO, Project, ProjectPM>>(ProjectControllerLocator.SaveProjectController)
  .to(HandleSaveProjectController)

projectContainer
  .bind<FindOneUseCase<Project>>(ProjectUseCaseLocator.FindOneProjectUseCase)
  .to(FindOneProjectUseCase)

projectContainer
  .bind<FindOneEntityRepository<Project>>(ProjectRepositoryLocator.FindOneProjectRepository)
  .to(FindOneProjectRepository)

projectContainer
  .bind<FindOneController<Project, ProjectPM>>(ProjectControllerLocator.FindOneProjectController)
  .to(HandleFindOneProjectController)

projectContainer
  .bind<FindAllEntityWithFilterRepository<Project, ProjectFilter>>(ProjectRepositoryLocator.FindAllProjectRepository)
  .to(FindAllProjectRepository)

projectContainer
  .bind<FindAllWithFilterUseCase<Project, ProjectFilter>>(ProjectUseCaseLocator.FindAllProjectUseCase)
  .to(FindAllProjectUseCase)

projectContainer
  .bind<FindAllProjectController>(ProjectControllerLocator.FindAllProjectController)
  .to(FindAllProjectController)

projectContainer
  .bind<UpdateEntityRepository<Project>>(ProjectRepositoryLocator.UpdateProjectRepository)
  .to(UpdateProjectRepository)

projectContainer
  .bind<UpdateUseCase<Project>>(ProjectUseCaseLocator.UpdateProjectUseCase)
  .to(UpdateProjectUseCase)

projectContainer
  .bind<HandleUpdateProjectController>(ProjectControllerLocator.UpdateProjectController)
  .to(HandleUpdateProjectController)

projectContainer
  .bind<DeleteEntityRepository>(ProjectRepositoryLocator.DeleteProjectRepository)
  .to(DeleteProjectRepository)

projectContainer
  .bind<DeleteUseCase>(ProjectUseCaseLocator.DeleteProjectUseCase)
  .to(DeleteProjectUseCase)

projectContainer
  .bind<DeleteController>(ProjectControllerLocator.DeleteProjectController)
  .to(HandleDeleteProjectController)

projectContainer
  .bind<NewValidationSchema>(ProjectSchemaValidationLocator.ProjectDTONewValidationSchema)
  .to(ProjectDTOZodValidation)

projectContainer
  .bind<NewValidationSchema>(ProjectSchemaValidationLocator.ProjectDTOUpdateNewValidationSchema)
  .to(ProjectUpdateDTOZodValidation)

projectContainer
  .bind<DeactivateEntityRepository<Project>>(ProjectRepositoryLocator.DeactivateProjectRepository)
  .to(DeactivateProjectRepository)

projectContainer
  .bind<DeactivateUseCase<Project>>(ProjectUseCaseLocator.DeactivateProjectUseCase)
  .to(DeactivateProjectUseCase)

projectContainer
  .bind<DeactivateController<Project>>(ProjectControllerLocator.DeactivateProjectController)
  .to(HandleDeactivateProjectController)

projectContainer
  .bind<ActivateEntityRepository<Project>>(ProjectRepositoryLocator.ActivateProjectRepository)
  .to(ActivateProjectRepository)

projectContainer
  .bind<ActivateUseCase<Project>>(ProjectUseCaseLocator.ActivateProjectUseCase)
  .to(ActivateProjectUseCase)

projectContainer
  .bind<ActivateController<Project>>(ProjectControllerLocator.ActivateProjectController)
  .to(HandleActivateProjectController)

projectContainer
  .bind<UpdateStatusUseCase<Project>>(ProjectUseCaseLocator.UpdateProjectStatusUseCase)
  .to(UpdateProjectStatusUseCase)

projectContainer
  .bind<UpdateStatusController<Project, ProjectPM>>(ProjectControllerLocator.UpdateProjectStatusController)
  .to(HandleUpdateProjectStatusController)

projectContainer
  .bind<UpdateStatusRepository>(ProjectRepositoryLocator.UpdateStatusRepository)
  .to(UpdateStatusRepository)

projectContainer
  .bind<FindAllFromEntityController<Project, ProjectPM>>(ProjectControllerLocator.FindAllProjectsFromUserController)
  .to(HandleFindAllProjectsFromUserController)

projectContainer
  .bind<FindAllFromEntityUseCase<Project>>(ProjectUseCaseLocator.FindAllProjectsFromUserUseCase)
  .to(FindAllProjectFromUserUseCase)

projectContainer
  .bind<FindAllFromEntityRepository<Project>>(ProjectRepositoryLocator.FindAllProjectsFromUserIdRepository)
  .to(FindAllProjectFromUserIdRepository)
