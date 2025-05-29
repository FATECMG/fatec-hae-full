import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'

import { AuthZodValidation } from '@functions/auth/adapter/validation/AuthValidation'

describe('AuthZodValidation', () => {
  let systemUnderTest: AuthZodValidation
  let authRequest: any

  beforeEach(() => {
    systemUnderTest = new AuthZodValidation()
    authRequest = {
      email: 'any@email.com',
      password: 'any_password'
    }
  })

  it('should return undefined if validation succeeds', () => {
    const result = systemUnderTest.validate(authRequest)

    expect(result).toBeUndefined()
  })

  it('should return ValidationError if email is invalid', () => {
    authRequest.email = 'invalid_email'

    const result = systemUnderTest.validate(authRequest)

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if email is undefined', () => {
    authRequest.email = undefined

    const result = systemUnderTest.validate(authRequest)

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if email is null', () => {
    authRequest.email = null

    const result = systemUnderTest.validate(authRequest)

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if password is undefined', () => {
    authRequest.password = undefined

    const result = systemUnderTest.validate(authRequest)

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if password is null', () => {
    authRequest.password = null

    const result = systemUnderTest.validate(authRequest)

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if validation fails', () => {
    authRequest.email = ''
    authRequest.password = ''

    const result = systemUnderTest.validate(authRequest)

    expect(result).toEqual(new ValidationError([]))
  })
})
