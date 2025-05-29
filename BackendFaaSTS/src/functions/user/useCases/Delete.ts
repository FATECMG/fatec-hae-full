import { type DeleteUseCase, type DeleteResult, FindOneUseCase } from '@common/domain/UseCase.interface'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'
import { type User } from '../entities/User'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'

/**
 * A use case class that handles the business logic for deleting a User entity.
 * Implements the DeleteUseCase interface.
 */
@injectable()
export class DeleteUserUseCase implements DeleteUseCase {
  /**
   * Creates a new instance of the DeleteUserUseCase class.
   * @param deleteOne - An object that implements the DeleteEntityRepository interface.
   * @param findOne - An object that implements the FindOneUseCase interface.
   * @param authService - An object that implements the AuthenticationService interface.
   */
  constructor (
    @inject(UserLocator.UserDeleteRepository)
    private readonly deleteOne: DeleteEntityRepository,
    @inject(UserLocator.UserFindOneUseCase)
    private readonly findOne: FindOneUseCase<User>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService
  ) {}

  /**
   * Executes the business logic for deleting a User entity.
   * @param id - The ID of the User entity to delete.
   * @returns A Promise that resolves to a DeleteResult object containing a boolean indicating whether the entity was deleted and a message string.
   */
  async execute (id: string): Promise<DeleteResult> {
    try {
      const user = await this.findOne.execute(id)
      if (user instanceof Error) {
        return {
          deleted: false,
          message: 'Não foi possível excluir, tente novamente mais tarde!'
        }
      }

      const disableResult = await this.authService.disableUser(user.email)

      if (disableResult) {
        await this.authService.deleteUser(user.email)
      } else {
        return {
          deleted: false,
          message: 'Não foi possível excluir, tente novamente mais tarde!'
        }
      }

      const repoResult = await this.deleteOne.perform(id)
      if (!repoResult) {
        return {
          deleted: false,
          message: 'Não foi possível excluir, tente novamente mais tarde!'
        }
      }

      return {
        deleted: true,
        message: 'Excluído com sucesso!'
      }
    } catch (error) {
      console.log(error)
      return {
        deleted: false,
        message: 'Erro inesperado ao excluir usuário!'
      }
    }
  }
}
