import {
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  InvalidPasswordException,
  NotAuthorizedException,
  SignUpCommand,
  UserNotFoundException,
  UsernameExistsException,
  AdminEnableUserCommand,
  AdminUpdateUserAttributesCommand,
  UserNotConfirmedException,
  AdminConfirmSignUpCommand
} from '@aws-sdk/client-cognito-identity-provider'

import { type AuthenticationService } from '../AuthenticationService.interface'

import {
  InvalidCredentialsError,
  InvalidTokenError,
  UserDataAlreadyExistsError
} from '@common/error/AuthenticationError'

import { InfraError } from '@common/error/InfraError'
import { ValidationError } from '@common/error/ValidationError'
import { UserNotFoundError } from '@common/error/NotFoundError'

import { type UserSignUp } from '@functions/auth/entities/SignUp'
import { type AuthRequest } from '@functions/auth/entities/AuthRequest'
import { type AuthTokenResponse } from '@functions/auth/entities/AuthTokenResponse'
import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'
import { type UserDataRequest } from '@functions/auth/entities/AuthUserDataRequest'

import { createHmac } from 'crypto'

import { injectable } from 'inversify'
import { type UserUpdate } from '@functions/auth/entities/Update'

@injectable()
export class CognitoAuthenticationService implements AuthenticationService {
  private readonly config = {
    region: process.env.COGNITO_REGION,
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET
  }

  private readonly secret = {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    secretHash: process.env.COGNITO_CLIENT_SECRET
  }

  private readonly cognito: CognitoIdentityProviderClient

  constructor () {
    if (!this.secret.userPoolId || !this.secret.clientId || 
      !this.secret.secretHash || !this.config.region || 
      !this.config.accessKeyId || !this.config.secretAccessKey)
        throw new InfraError('Erro Inesperado!')

    this.cognito = new CognitoIdentityProviderClient({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey
      }
    })
  }

  async getUserByToken ({ accessToken }: UserDataRequest): Promise<UserDataResponse> {
    try {
      const getUserCommand = await new GetUserCommand({
        AccessToken: accessToken
      })
      const getUserResponse = await this.cognito.send(getUserCommand)
      if (getUserResponse.$metadata.httpStatusCode === 200) {
        return {
          id: getUserResponse.UserAttributes?.find(
            (attribute: { Name?: string }) =>
              attribute.Name === 'custom:id'
          )?.Value,
          name: getUserResponse.UserAttributes?.find(
            (attribute: { Name?: string }) =>
              attribute.Name === 'name'
          )?.Value,
          email: getUserResponse.UserAttributes?.find(
            (attribute: { Name?: string }) =>
              attribute.Name === 'email'
          )?.Value,
          role: getUserResponse.UserAttributes?.find(
            (attribute: { Name?: string }) =>
              attribute.Name === 'custom:role'
          )?.Value
        }
      }
      throw new InfraError('Erro Inesperado!')
    } catch (error) {
      if (error instanceof NotAuthorizedException) {
        if (error.message === 'Access Token has expired') {
          throw new InvalidTokenError()
        }
      }
      throw new InfraError('Erro Inesperado!')
    }
  }

  async signUp (credentials: UserSignUp): Promise<boolean | Error> {
    try {
      const signUpCommand = await new SignUpCommand({
        ClientId: this.secret.clientId,
        Password: credentials.password,
        Username: credentials.email,
        SecretHash: this.getSecretHash(credentials.email),
        UserAttributes: [
          {
            Name: 'name',
            Value: credentials.name
          },
          {
            Name: 'email',
            Value: credentials.email
          },
          {
            Name: 'custom:role',
            Value: credentials.role
          },
          {
            Name: 'custom:id',
            Value: credentials.id
          }
        ]
      })

      const signUpResponse = await this.cognito.send(signUpCommand)


      if (signUpResponse.$metadata.httpStatusCode === 200) {
        await this.confirmUser(credentials.email)
      }

      return signUpResponse.$metadata.httpStatusCode === 200
    } catch (error) {
      if (error instanceof UsernameExistsException) {
        throw new UserDataAlreadyExistsError('email')
      }

      if (error instanceof InvalidPasswordException) {
        throw new ValidationError([
          {
            field: 'password',
            message: 'Senha Inválida: a senha não atende à política de senha!'
          }
        ])
      }

      throw new InfraError('Erro Inesperado!')
    }
  }

  async signIn (credentials: AuthRequest): Promise<AuthTokenResponse | Error> {
    try {
      const signInCommmand = await new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.secret.clientId,
        AuthParameters: {
          USERNAME: credentials.email,
          PASSWORD: credentials.password,
          SECRET_HASH: this.getSecretHash(credentials.email)
        }
      })
      const signInResponse = await this.cognito.send(signInCommmand)
      return {
        idToken: signInResponse.AuthenticationResult?.IdToken,
        accessToken: signInResponse.AuthenticationResult?.AccessToken,
        refreshToken: signInResponse.AuthenticationResult?.RefreshToken,
        expiresInSeconds:
                    signInResponse.AuthenticationResult?.ExpiresIn,
        tokenType: signInResponse.AuthenticationResult?.TokenType
      }
    } catch (error) {
      if (error instanceof NotAuthorizedException) {
        throw new InvalidCredentialsError('login')
      }

      if (error instanceof UserNotConfirmedException) {
        throw new ValidationError([{ field: 'email', message: 'Usuário não confirmado! Verifique a Caixa de Email!' }])
      }

      throw new InfraError('Erro Inesperado!')
    }
  }

  async deleteUser (username: string): Promise<boolean | Error> {
    try {
      const adminDeleteUserCommand = await new AdminDeleteUserCommand({
        UserPoolId: this.secret.userPoolId,
        Username: username
      })

      const adminDeleteUserResponse = await this.cognito.send(
        adminDeleteUserCommand
      )

      return adminDeleteUserResponse.$metadata.httpStatusCode === 200
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(username)
      }
      throw new InfraError('Erro Inesperado!')
    }
  }

  async disableUser (username: string): Promise<boolean | Error> {
    try {
      const adminDisableUserCommand = new AdminDisableUserCommand({
        UserPoolId: this.secret.userPoolId,
        Username: username
      })

      const adminDisableUserResponse = await this.cognito.send(
        adminDisableUserCommand
      )

      return adminDisableUserResponse.$metadata.httpStatusCode === 200
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(username)
      }
      throw new InfraError('Erro Inesperado!')
    }
  }

  async enableUser (username: string): Promise<boolean | Error> {
    try {
      const adminEnableUserCommand = new AdminEnableUserCommand({
        UserPoolId: this.secret.userPoolId,
        Username: username
      })

      const adminEnableUserResponse = await this.cognito.send(
        adminEnableUserCommand
      )

      return adminEnableUserResponse.$metadata.httpStatusCode === 200
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(username)
      }
      throw new InfraError('Erro Inesperado!')
    }
  }

  async updateUserData (credentials: UserUpdate): Promise<boolean | Error> {
    try {
      const adminUpdateUserCommand = new AdminUpdateUserAttributesCommand(
        {
          UserPoolId: this.secret.userPoolId,
          Username: credentials.email,
          UserAttributes: [
            {
              Name: 'name',
              Value: credentials.name
            },
            {
              Name: 'custom:role',
              Value: credentials.role
            }
          ]
        }
      )

      const adminUpdateUserResponse = await this.cognito.send(
        adminUpdateUserCommand
      )

      return adminUpdateUserResponse.$metadata.httpStatusCode === 200
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(credentials.email)
      }

      throw new InfraError('Erro Inesperado!')
    }
  }

  private async confirmUser (username: string): Promise<undefined | Error> {
    try {
      const adminConfirmSignUpCommand = new AdminConfirmSignUpCommand({
        UserPoolId: this.secret.userPoolId,
        Username: username
      })


      await this.cognito.send(adminConfirmSignUpCommand)

     return undefined
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(username)
      }

      throw new InfraError('Erro Inesperado!')
    }
  }

  private getSecretHash (username: string): string {
    const message = username + this.secret.clientId
    if (!this.secret.secretHash) {
      throw new InfraError('Erro Inesperado!')
    }
    return createHmac('SHA256', this.secret.secretHash)
      .update(message)
      .digest('base64')
  }
}
