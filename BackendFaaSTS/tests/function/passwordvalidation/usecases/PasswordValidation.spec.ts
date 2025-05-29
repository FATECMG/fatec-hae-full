import { PasswordPolicyValidator } from '@functions/passwordvalidation/adapter/validation/PasswordPolicy'
import { PasswordValidatorUseCase } from '@functions/passwordvalidation/usecases/PasswordValidation'
import { ValidationError } from '@common/error/ValidationError'

describe('PasswordPolicy Use Case', () => {
  let password: string
  let validatorMock: jest.SpyInstance
  let systemUnderTest: PasswordValidatorUseCase

  beforeAll(() => {
    systemUnderTest = new PasswordValidatorUseCase()

    password = 'AnyPassword123@'
    validatorMock = jest
      .spyOn(PasswordPolicyValidator, 'validate')
      .mockImplementation(() => undefined)
  })

  it('should return true when validate succeeds', async () => {
    const response = await systemUnderTest.execute(password)

    expect(response).toBe(true)
  })

  it('should return an Validation error when validate fails', async () => {
    validatorMock.mockImplementationOnce(() => {
      throw new ValidationError([{
        field: 'anyField',
        message: 'anyMessage'
      }])
    })

    const response = await systemUnderTest.execute(password)

    expect(response).toBeInstanceOf(ValidationError)
  })

  it('should return an InfraError when error is not an instance of ValidationError', async () => {
    validatorMock.mockImplementationOnce(() => {
      throw new Error('AnyError')
    })

    const response = await systemUnderTest.execute(password)

    expect(response).toBeInstanceOf(Error)
    expect(response).not.toBeInstanceOf(ValidationError)
  })
})
