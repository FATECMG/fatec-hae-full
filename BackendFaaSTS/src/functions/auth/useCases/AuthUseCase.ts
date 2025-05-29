import { AuthenticationError } from '@common/error/AuthenticationError'
import { type AuthenticateUseCase } from '@functions/auth/useCases/Interface'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'

import { inject, injectable } from 'inversify'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { type AuthTokenResponse } from '@functions/auth/entities/AuthTokenResponse'
import { InfraError } from '@common/error/InfraError'
import { ValidationError } from '@common/error/ValidationError'

@injectable()
export class AuthUseCase implements AuthenticateUseCase {
  constructor (
    @inject(AuthenticatorLocator.CognitoAuthenticationService) private readonly authService: AuthenticationService
  ) {}

  async execute (email: string, password: string): Promise<AuthTokenResponse | Error> {
    try {
      const authToken = await this.authService.signIn({ email, password })
      return authToken
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return error
      }

      if (error instanceof ValidationError) {
        return error
      }
      return new InfraError('Erro inesperado!')
    }
  }
}
