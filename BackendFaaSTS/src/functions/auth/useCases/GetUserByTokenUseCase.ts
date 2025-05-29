import { CognitoAuthenticationService } from '@common/auth/cognito/CognitoAuthenticationService'
import { InvalidTokenError } from '@common/error/AuthenticationError'

import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'
import { type UserDataRequest } from '@functions/auth/entities/AuthUserDataRequest'

import { inject, injectable } from 'inversify'

@injectable()
export class GetUserByTokenUseCase implements GetUserByTokenUseCase {
  constructor (
    @inject(AuthenticatorLocator.CognitoAuthenticationService) private readonly auth: CognitoAuthenticationService
  ) {}

  async execute (token: UserDataRequest): Promise<UserDataResponse | Error> {
    try {
      const userData = await this.auth.getUserByToken({ accessToken: token.accessToken })
      return userData
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return error
      }
      throw new Error('Erro Inesperado!')
    }
  }
}
