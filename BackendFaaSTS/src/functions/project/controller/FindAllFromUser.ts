import { FindAllFromEntityController } from '@common/domain/Controllers'
import { FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { type Project } from '../entities/Project'
import { type ProjectPM } from '../entities/pm/ProjectPM'

import { injectable, inject } from 'inversify'
import { ProjectMapperLocator, ProjectUseCaseLocator } from '../shared/Di.enums'

@injectable()
export class HandleFindAllProjectsFromUserController extends FindAllFromEntityController<Project, ProjectPM> {
  constructor (
    @inject(ProjectUseCaseLocator.FindAllProjectsFromUserUseCase) readonly findAllUseCase: FindAllFromEntityUseCase<Project>,
    @inject(ProjectMapperLocator.ProjectPresentationModelMapper) readonly PMFromEntity: Mapper<Project, ProjectPM>
  ) {
    super(PMFromEntity, findAllUseCase)
  }
}
