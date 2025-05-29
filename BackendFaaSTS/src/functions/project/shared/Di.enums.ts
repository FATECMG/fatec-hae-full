export const ProjectMapperLocator = {
  ProjectMapper: Symbol.for('ProjectMapper'),
  ProjectPresentationModelMapper: Symbol.for('ProjectPresentationModelMapper'),
  ProjectUpdateMapper: Symbol.for('ProjectUpdateMapper')
}

export const ProjectUseCaseLocator = {
  FindOneProjectUseCase: Symbol.for('FindOneProjectUseCase'),
  FindAllProjectUseCase: Symbol.for('FindAllProjectUseCase'),
  UpdateProjectUseCase: Symbol.for('UpdateProjectUseCase'),
  DeleteProjectUseCase: Symbol.for('DeleteProjectUseCase'),
  SaveProjectUseCase: Symbol.for('SaveProjectUseCase'),
  DeactivateProjectUseCase: Symbol.for('DeactivateProjectUseCase'),
  ActivateProjectUseCase: Symbol.for('ActivateProjectUseCase'),
  UpdateProjectStatusUseCase: Symbol.for('UpdateProjectStatusUseCase'),
  FindAllProjectsFromUserUseCase: Symbol.for('FindAllProjectFromUserUseCase')
}

export const ProjectRepositoryLocator = {
  FindOneProjectRepository: Symbol.for('FindOneProjectRepository'),
  FindAllProjectRepository: Symbol.for('FindAllProjectRepository'),
  UpdateProjectRepository: Symbol.for('UpdateProjectRepository'),
  DeleteProjectRepository: Symbol.for('DeleteProjectRepository'),
  SaveProjectRepository: Symbol.for('SaveProjectRepository'),
  DeactivateProjectRepository: Symbol.for('DeactivateProjectRepository'),
  ActivateProjectRepository: Symbol.for('ActivateProjectRepository'),
  UpdateStatusRepository: Symbol.for('UpdateStatusRepository'),
  FindAllProjectsFromUserIdRepository: Symbol.for('FindAllProjectFromUserIdRepository')
}

export const ProjectControllerLocator = {
  FindOneProjectController: Symbol.for('FindOneProjectController'),
  FindAllProjectController: Symbol.for('FindAllProjectController'),
  UpdateProjectController: Symbol.for('UpdateProjectController'),
  DeleteProjectController: Symbol.for('DeleteProjectController'),
  SaveProjectController: Symbol.for('SaveProjectController'),
  DeactivateProjectController: Symbol.for('DeactivateProjectController'),
  ActivateProjectController: Symbol.for('ActivateProjectController'),
  UpdateProjectStatusController: Symbol.for('UpdateProjectStatusController'),
  FindAllProjectsFromUserController: Symbol.for('FindAllProjectFromUserController')
}

export const ProjectSchemaValidationLocator = {
  ProjectDTONewValidationSchema: Symbol.for('ProjectDTOValidationSchema'),
  ProjectDTOUpdateNewValidationSchema: Symbol.for('ProjectDTOUpdateNewValidationSchema')
}
