import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'
import { CourseZodValidation } from '@functions/course/adapter/validation/CourseZodValidation'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'

describe('CourseZodValidation', () => {
  let systemUnderTest: CourseZodValidation
  let baseCourse: CourseDTO

  beforeAll(() => {
    systemUnderTest = new CourseZodValidation()

    baseCourse = {
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno'],
      active: true
    }
  })

  it('should return undefined if the course is valid', () => {
    const result = systemUnderTest.validate(baseCourse)

    expect(result).toBeUndefined()
  })

  it('should return undefined if undefined active is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, active: undefined })

    expect(result).toBeUndefined()
  })

  it('should return ValidationError if empty name is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, name: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null name is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, name: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined name is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, name: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty acronym is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, acronym: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null acronym is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, acronym: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined acronym is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, acronym: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty code is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, code: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null code is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, code: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined code is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, code: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty coordinator is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, coordinator: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null coordinator is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, coordinator: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined coordinator is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, coordinator: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, schedule: [] })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, schedule: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, schedule: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseCourse, schedule: ['invalid_schedule'] })

    expect(result).toEqual(new ValidationError([]))
  })
})
