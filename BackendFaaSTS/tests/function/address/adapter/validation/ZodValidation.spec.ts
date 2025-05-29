import 'reflect-metadata'

import { CepZodValidation } from '@functions/address/adapter/validation/ZodValidation'
import { ValidationError } from '@common/error/ValidationError'

describe('ZodValidation', () => {
  let systemUnderTest: CepZodValidation

  beforeAll(() => {
    systemUnderTest = new CepZodValidation()
  })

  it('should return undefined if valid data is sent', () => {
    const result = systemUnderTest.validate('12345789')

    expect(result).toBeUndefined()
  })

  it('should return ValidationError if invalid postCode is sent', () => {
    const result = systemUnderTest.validate('invalid!')

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid length postCode is sent', () => {
    const result = systemUnderTest.validate('12312312312312312312')

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid format postCode is sent', () => {
    const result = systemUnderTest.validate('1234-567')

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null postCode is sent', () => {
    const result = systemUnderTest.validate(null)

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined postCode is sent', () => {
    const result = systemUnderTest.validate(undefined)

    expect(result).toEqual(new ValidationError([]))
  })
})
