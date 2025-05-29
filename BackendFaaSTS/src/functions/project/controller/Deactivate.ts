import { DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateController } from '@common/domain/Controllers'

import { type Project } from '@functions/project/entities/Project'
import { ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'
@injectable()
export class HandleDeactivateProjectController extends DeactivateController<Project> {
  constructor (
  @inject(ProjectUseCaseLocator.DeactivateProjectUseCase) deactivateUseCase: DeactivateUseCase<Project>
  ) {
    super(deactivateUseCase)
  }
}
