import 'reflect-metadata'

import { type AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { UserDataAlreadyExistsError } from '@common/error/AuthenticationError'
import { InfraError } from '@common/error/InfraError'
import { type UserSignUp } from '@functions/auth/entities/SignUp'
import { SignUpUseCase } from '@functions/auth/useCases/SignUpUseCase'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('SignUpUseCase', () => {
  let systemUnderTest: SignUpUseCase
  let authService: MockProxy<AuthenticationService>
  let credentials: UserSignUp

  beforeEach(() => {
    credentials = {
      id: 'any_id',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
      role: 'any_role'
    }
    authService = mock()
    authService.signUp.mockResolvedValue(true)
    systemUnderTest = new SignUpUseCase(authService)
  })

  it('should call authService with correct params', async () => {
    await systemUnderTest.execute(credentials)

    expect(authService.signUp).toHaveBeenCalledWith(credentials)
    expect(authService.signUp).toHaveBeenCalledTimes(1)
  })

  it('should return true if signUp is successful', async () => {
    const result = await systemUnderTest.execute(credentials)

    expect(result).toEqual(true)
  })

  it('should return UserDataAlreadyExistsError if email already exists', async () => {
    authService.signUp.mockRejectedValueOnce(new UserDataAlreadyExistsError('email'))

    const result = await systemUnderTest.execute(credentials)

    expect(result).toEqual(new UserDataAlreadyExistsError('email'))
  })

  it('should return InfraError if signUp throws unexpected error', async () => {
    authService.signUp.mockRejectedValueOnce(new Error('any_error'))

    const result = await systemUnderTest.execute(credentials)

    expect(result).toEqual(new InfraError('Erro Inesperado!'))
  })
})
