import { DeactivateUseCase } from '@common/domain/UseCase.interface'
import { DeactivateController } from '@common/domain/Controllers'

import { UserLocator } from '@functions/user/shared/Di.enums'
import { type Project } from '@functions/project/entities/Project'
import { type User } from '@functions/user/entities/User'

import { injectable, inject } from 'inversify'

@injectable()
export class DeactivateUser extends DeactivateController<Project> {
  constructor (
  @inject(UserLocator.UserDeactivateUseCase) deactivateUseCase: DeactivateUseCase<User>
  ) {
    super(deactivateUseCase)
  }
}
