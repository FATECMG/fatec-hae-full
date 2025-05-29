import { FindOneUseCase } from '@common/domain/UseCase.interface'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindOneController } from '@common/domain/Controllers'

import { type Project } from '@functions/project/entities/Project'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'
import { ProjectMapperLocator, ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'
@injectable()
export class HandleFindOneProjectController extends FindOneController<Project, ProjectPM> {
  constructor (
    @inject(ProjectUseCaseLocator.FindOneProjectUseCase) readonly findOneUseCase: FindOneUseCase<Project>,
    @inject(ProjectMapperLocator.ProjectPresentationModelMapper) readonly PMFromEntity: Mapper<Project, ProjectPM>
  ) {
    super(PMFromEntity, findOneUseCase)
  }
}
