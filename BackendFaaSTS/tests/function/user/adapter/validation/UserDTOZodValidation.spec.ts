import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'
import { UserDTOZodValidation } from '@functions/user/adapter/validation/ZodUserDTOValidation'
import { UserDTO } from '@functions/user/entities/dto/UserDTO'

describe('ZodUserDTOValidation', () => {
  let baseUser: UserDTO
  let systemUnderTest: UserDTOZodValidation

  beforeAll(() => {
    baseUser = new UserDTO({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: true
    })
    systemUnderTest = new UserDTOZodValidation()
  })

  it('should return undefined if valid data is passed', () => {
    const result = systemUnderTest.validate(baseUser)
    expect(result).toBeUndefined()
  })

  it('should return undefined if valid data without active property is passed', () => {
    const result = systemUnderTest.validate({ ...baseUser, active: undefined })
    expect(result).toBeUndefined()
  })

  it('should return ValidationError if empty name is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, name: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null name is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, name: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined name is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, name: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid length name is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid email is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, email: 'any_email' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty email is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, email: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null email is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, email: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined email is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, email: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty password is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, password: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null password is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, password: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined password is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, password: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty phone is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, phone: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null phone is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, phone: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined phone is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, phone: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty registerNumber is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, registerNumber: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null registerNumber is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, registerNumber: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined registerNumber is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, registerNumber: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid length registerNumber is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, registerNumber: 'any_registerNumber_any_registerNumber_any_registerNumber' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty roles is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null roles is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined roles is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty academicTitle is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, academicTitle: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null academicTitle is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, academicTitle: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined academicTitle is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, academicTitle: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should not return ValidationError if empty courses is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, courses: [] })
    expect(result).toBeUndefined()
  })

  it('should not return ValidationError if null courses is sent', () => {
    const result = systemUnderTest.validate({ ...baseUser, courses: null })
    expect(result).toBeUndefined()
  })

  it('should return ValidationError if null courses is sent for professor user', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: 'PROFESSOR', courses: null })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null courses is sent for coordinator user', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: 'COORDENADOR', courses: null })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty courses is sent for professor user', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: 'PROFESSOR', courses: [] })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty courses is sent for coordinator user', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: 'COORDENADOR', courses: [] })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should not return ValidationError if valid courses is sent for professor user', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: 'PROFESSOR' })
    expect(result).toBeUndefined()
  })

  it('should not return ValidationError if valid courses is sent for coordinator user', () => {
    const result = systemUnderTest.validate({ ...baseUser, roles: 'COORDENADOR' })
    expect(result).toBeUndefined()
  })
})
