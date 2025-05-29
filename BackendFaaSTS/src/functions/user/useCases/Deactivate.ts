import { AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { FindOneUseCase, type DeactivateUseCase } from '@common/domain/UseCase.interface'
import { ActivateEntityRepository, DeactivateEntityRepository } from '@common/repository/RepositoryInterface'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'

import { type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeactivateUserUseCase implements DeactivateUseCase<User> {
  constructor (
    @inject(UserLocator.UserDeactivateRepository)
    private readonly deactivate: DeactivateEntityRepository<User>,
    @inject(UserLocator.UserFindOneUseCase)
    private readonly findOne: FindOneUseCase<User>,
    @inject(UserLocator.UserActivateRepository)
    private readonly activate: ActivateEntityRepository<User>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService
  ) {}

  async execute (id: string): Promise<{ deleted: boolean, message: string }> {
    try {
      const user = await this.findOne.execute(id)

      if (user instanceof Error) {
        return {
          deleted: false,
          message: 'Não foi possível excluir, tente novamente mais tarde!'
        }
      }

      const disableResult = await this.authService.disableUser(user.email)

      const result = await this.deactivate.perform(id)

      if ((disableResult instanceof Error || !disableResult) && result) {
        await this.activate.perform(id)
      }

      return result && disableResult
        ? { deleted: result, message: 'Excluido com sucesso' }
        : { deleted: result, message: 'Não foi possível excluir, tente novamente mais tarde!' }
    } catch (error) {
      return { deleted: false, message: 'Não foi possível excluir, tente novamente mais tarde!' }
    }
  }
}
