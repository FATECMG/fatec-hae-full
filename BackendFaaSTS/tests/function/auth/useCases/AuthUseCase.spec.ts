import 'reflect-metadata'
import { mock, type MockProxy } from 'jest-mock-extended'

import { InvalidCredentialsError } from '@common/error/AuthenticationError'

import { AuthUseCase } from '@functions/auth/useCases/AuthUseCase'
import { ValidationError } from '@common/error/ValidationError'
import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'

describe('AuthUseCase', () => {
  let systemUnderTest: AuthUseCase
  let authService: MockProxy<AuthenticationService>

  beforeEach(() => {
    authService = mock()
    systemUnderTest = new AuthUseCase(authService)

    authService.signIn.mockResolvedValue({
      accessToken: 'any_access_token',
      idToken: 'any_id_token',
      refreshToken: 'any_refresh_token',
      expiresInSeconds: 3600,
      tokenType: 'any_token_type'
    })
  })

  it('should call authService with correct params', async () => {
    await systemUnderTest.execute('any_email', 'any_password')

    expect(authService.signIn).toHaveBeenCalledWith({ email: 'any_email', password: 'any_password' })
  })

  it('should return InvalidCredentialsError if user is not found', async () => {
    authService.signIn.mockResolvedValueOnce(new InvalidCredentialsError('login'))

    const result = await systemUnderTest.execute('any_email', 'any_password')

    expect(result).toEqual(new InvalidCredentialsError('login'))
  })

  it('should return ValidationError if validation fails', async () => {
    authService.signIn.mockResolvedValueOnce(new ValidationError([{ field: 'any_field', message: 'any_message' }]))

    const result = await systemUnderTest.execute('any_email', 'any_password')

    expect(result).toEqual(new ValidationError([{ field: 'any_field', message: 'any_message' }]))
  })
})
