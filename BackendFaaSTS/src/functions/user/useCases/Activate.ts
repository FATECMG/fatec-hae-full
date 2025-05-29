import { type ActivateUseCase, FindOneUseCase } from '@common/domain/UseCase.interface'
import { ActivateEntityRepository, DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'

import { inject, injectable } from 'inversify'

@injectable()
export class ActivateUserUseCase implements ActivateUseCase<User> {
  constructor (
    @inject(UserLocator.UserActivateRepository)
    private readonly activate: ActivateEntityRepository<User>,
    @inject(UserLocator.UserDeactivateRepository)
    private readonly deactivate: DeactivateEntityRepository<User>,
    @inject(UserLocator.UserFindOneUseCase)
    private readonly findOne: FindOneUseCase<User>,
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService
  ) {}

  async execute (id: string): Promise<{ deleted: boolean, message: string }> {
    let user: User | Error
    let enableResult: boolean | Error

    try {
      user = await this.findOne.execute(id)

      if (user instanceof Error) {
        return {
          deleted: false,
          message: 'Não foi possível ativar, tente novamente mais tarde!'
        }
      }

      enableResult = await this.authService.enableUser(user.email)

      const result = await this.activate.perform(id)

      if ((enableResult instanceof Error || !enableResult) && result) {
        await this.deactivate.perform(id)
      }

      return result && enableResult
        ? { deleted: result, message: 'Ativado com sucesso' }
        : { deleted: result, message: 'Não foi possível ativar, tente novamente mais tarde!' }
    } catch (error) {
      return { deleted: false, message: 'Não foi possível ativar, tente novamente mais tarde!' }
    }
  }
}
