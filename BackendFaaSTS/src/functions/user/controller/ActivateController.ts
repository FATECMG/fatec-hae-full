import { ActivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateController } from '@common/domain/Controllers'

import { UserLocator } from '@functions/user/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { type User } from '@functions/user/entities/User'

import { injectable, inject } from 'inversify'

@injectable()
export class ActivateUser extends ActivateController<Project> {
  constructor (
  @inject(UserLocator.UserActivateUseCase) activateUseCase: ActivateUseCase<User>
  ) {
    super(activateUseCase)
  }
}
