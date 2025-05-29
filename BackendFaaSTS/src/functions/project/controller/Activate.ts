import { ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateController } from '@common/domain/Controllers'

import { type Project } from '@functions/project/entities/Project'
import { ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class HandleActivateProjectController extends ActivateController<Project> {
  constructor (
  @inject(ProjectUseCaseLocator.ActivateProjectUseCase) activateUseCase: ActivateUseCase<Project>
  ) {
    super(activateUseCase)
  }
}
