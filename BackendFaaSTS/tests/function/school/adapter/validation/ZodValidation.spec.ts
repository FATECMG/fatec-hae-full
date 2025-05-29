import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'
import { SchoolDTOZodValidation } from '@functions/school/adapter/validation/ZodValidation'

describe('ZodValidation', () => {
  let baseSchool: any
  let address: any
  let systemUnderTest: SchoolDTOZodValidation

  beforeAll(() => {
    address = {
      city: 'any_city',
      district: 'any_district',
      postCode: '12345-789',
      state: 'ST',
      street: 'any_street',
      complement: 'any_complement',
      number: 'any_number'
    }
    baseSchool = {
      name: 'any_name',
      address,
      active: true
    }
    systemUnderTest = new SchoolDTOZodValidation()
  })

  it('should return undefined if valid data is sent', () => {
    const result = systemUnderTest.validate(baseSchool)

    expect(result).toBeUndefined()
  })

  it('should return undefined if undefined number is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, number: undefined } })

    expect(result).toBeUndefined()
  })

  it('should return undefined if undefined complement is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, complement: undefined } })

    expect(result).toBeUndefined()
  })

  it('should return ValidationError if empty name is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, name: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null name is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, name: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined name is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, name: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid length name is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid postCode is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, postCode: '' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid length postCode is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, postCode: '123453214543244' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid format postCode is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, postCode: '123456789' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null postCode is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, postCode: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined postCode is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, postCode: '123456789' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty street is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, street: '' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined street is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, street: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null street is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, street: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty city is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, city: '' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined city is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, city: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null city is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, city: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty district is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, district: '' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined district is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, district: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null district is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, district: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null number is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, number: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null complement is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, complement: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid State is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, state: 'invalid' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null State is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, state: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined State is sent', () => {
    const result = systemUnderTest.validate({ ...baseSchool, address: { ...address, state: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })
})
