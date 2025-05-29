
import { inject, injectable } from 'inversify'
import { AuthenticatorLocator } from '../shared/Di.enums'
import { UserDataAlreadyExistsError } from '@common/error/AuthenticationError'
import { type AuthSignUpUseCase } from '@common/auth/SignUpUseCase.interface'
import { type UserSignUp } from '../entities/SignUp'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { InfraError } from '@common/error/InfraError'
import { ValidationError } from '@common/error/ValidationError'

@injectable()
export class SignUpUseCase implements AuthSignUpUseCase {
  constructor (
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService
  ) {}

  async execute (credentials: UserSignUp): Promise<boolean | Error> {
    try {
      const response = await this.authService.signUp(credentials)
      return response
    } catch (error) {
      if (error instanceof UserDataAlreadyExistsError) {
        return error
      }

      if (error instanceof ValidationError) {
        return error
      }

      return new InfraError('Erro Inesperado!')
    }
  }
}
