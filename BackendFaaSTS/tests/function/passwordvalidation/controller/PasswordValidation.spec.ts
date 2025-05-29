import { PasswordValidatorController } from '@functions/passwordvalidation/controller/PasswordValidatorController'
import { mock, type MockProxy } from 'jest-mock-extended'
import { type PasswordValidatorUseCase } from '@functions/passwordvalidation/usecases/PasswordValidation'
import { ValidationError } from '@common/error/ValidationError'

describe('PasswordPolicy Controller', () => {
  let password: string
  let passwordValidatorUseCase: MockProxy<PasswordValidatorUseCase>
  let systemUnderTest: PasswordValidatorController

  beforeAll(() => {
    password = 'any_password'

    passwordValidatorUseCase = mock()
    passwordValidatorUseCase.execute.mockResolvedValue(true)
    systemUnderTest = new PasswordValidatorController(passwordValidatorUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle(password)

    expect(result).toEqual({ statusCode: 200, data: true })
  })

  it('should return 400 on useCase fail', async () => {
    passwordValidatorUseCase.execute.mockResolvedValueOnce(new ValidationError([{
      field: 'any_field',
      message: 'any_message'
    }]))

    const result = await systemUnderTest.handle(password)

    expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_message' }] })
  })
})
