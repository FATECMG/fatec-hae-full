import { SaveController } from '@common/domain/Controllers'
import { Mapper } from '@common/mapper/BaseMapper'
import { SaveUseCase } from '@common/domain/UseCase.interface'
import { NewValidationSchema } from '@common/validation/Validate'

import { type ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'
import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectUseCaseLocator, ProjectMapperLocator, ProjectSchemaValidationLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class HandleSaveProjectController extends SaveController<ProjectDTO, Project, ProjectPM> {
  constructor (
  @inject(ProjectUseCaseLocator.SaveProjectUseCase) saveUseCase: SaveUseCase<Project>,
    @inject(ProjectSchemaValidationLocator.ProjectDTONewValidationSchema) dtoValidator: NewValidationSchema,
    @inject(ProjectMapperLocator.ProjectMapper) entityFromDTOMapper: Mapper<ProjectDTO, Project>,
    @inject(ProjectMapperLocator.ProjectPresentationModelMapper) PMFromEntity: Mapper<Project, ProjectPM>
  ) {
    super(dtoValidator, entityFromDTOMapper, PMFromEntity, saveUseCase)
  }
}
