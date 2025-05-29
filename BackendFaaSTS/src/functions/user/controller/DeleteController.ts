import { type DeleteUseCase } from '@common/domain/UseCase.interface'
import { DeleteController } from '@common/domain/Controllers'

import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

/**
 * A controller class that handles HTTP DELETE requests for deleting a User entity.
 */
@injectable()
export class DeleteUserController extends DeleteController {
  /**
   * Creates a new instance of the DeleteUserController class.
   * @param deleteUserUseCase - The DeleteUseCase object that handles the business logic for deleting a User entity.
   */
  constructor (@inject(UserLocator.UserDeleteUseCase) deleteUserUseCase: DeleteUseCase) {
    super(deleteUserUseCase)
  }
}
