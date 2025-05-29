import { DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteController } from '@common/domain/Controllers'

import { ProjectUseCaseLocator } from '@functions/project/shared/Di.enums'

import { inject, injectable } from 'inversify'
@injectable()
export class HandleDeleteProjectController extends DeleteController {
  constructor (
    @inject(ProjectUseCaseLocator.DeleteProjectUseCase) readonly deleteUseCase: DeleteUseCase
  ) {
    super(deleteUseCase)
  }
}
