import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'

import { type NewValidationSchema } from '@common/validation/Validate'
import { ValidationError } from '@common/error/ValidationError'
import { InvalidCredentialsError } from '@common/error/AuthenticationError'

import { type AuthRequest } from '@functions/auth/entities/AuthRequest'
import { AuthController } from '@functions/auth/controller/AuthController'
import { type AuthenticateUseCase } from '@functions/auth/useCases/Interface'
import { type AuthTokenResponse } from '@functions/auth/entities/AuthTokenResponse'

describe('AuthenticationController', () => {
  let templateRequest: AuthRequest
  let templateResponse: AuthTokenResponse
  let systemUnderTest: AuthController
  let dtoValidator: MockProxy<NewValidationSchema>
  let authUseCase: MockProxy<AuthenticateUseCase>

  beforeAll(() => {
    templateRequest = { email: 'any_email', password: 'any_password' }
    dtoValidator = mock()
    authUseCase = mock()

    templateResponse = {
      accessToken: 'any_access_token',
      idToken: 'any_id_token',
      refreshToken: 'any_refresh_token',
      expiresInSeconds: 3600,
      tokenType: 'any_token_type'
    }

    authUseCase.execute.mockResolvedValue({
      accessToken: 'any_access_token',
      idToken: 'any_id_token',
      refreshToken: 'any_refresh_token',
      expiresInSeconds: 3600,
      tokenType: 'any_token_type'
    })
    systemUnderTest = new AuthController(dtoValidator, authUseCase)
  })

  it('should return 200 on useCases.execute success', async () => {
    const result = await systemUnderTest.handle(templateRequest)

    expect(result).toEqual({ statusCode: 200, data: templateResponse })
  })

  it('should return 400 on validator ValidationError', async () => {
    dtoValidator.validate.mockImplementationOnce(jest.fn(() => new ValidationError([{ field: 'any_field', message: 'any_error' }])))

    const result = await systemUnderTest.handle(templateRequest)

    expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_error' }] })
  })

  it('should return 401 on useCases.execute InvalidCredentialsError', async () => {
    authUseCase.execute.mockResolvedValueOnce(new InvalidCredentialsError('login'))

    const result = await systemUnderTest.handle(templateRequest)

    expect(result).toEqual({ statusCode: 401, data: new InvalidCredentialsError('login').message })
  })

  it('should return 500 on useCases.execute infra failure', async () => {
    authUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateRequest)

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
