import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'
import NoticeZodValidation from '@functions/notice/adapter/validation/NoticeZodValidation'
import type NoticeDTO from '@functions/notice/entities/dto/NoticeDTO'

describe('NoticeZodValidation', () => {
  let systemUnderTest: NoticeZodValidation
  let baseNotice: NoticeDTO

  beforeAll(() => {
    systemUnderTest = new NoticeZodValidation()

    baseNotice = {
      title: 'any_title',
      description: 'any_description any_description any_description any_description any_description any_description any_description',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      semester: 'any_semester',
      year: 'any_year',
      topicsOfInterest: ['any_topicsOfInterest'],
      active: true
    }
  })

  it('should return undefined if the Notice is valid', () => {
    const result = systemUnderTest.validate(baseNotice)
    expect(result).toBeUndefined()
  })

  it('should return undefined if undefined active is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, active: undefined })
    expect(result).toBeUndefined()
  })

  it('should return ValidationError if empty title is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, title: '' })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty title with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, title: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null title is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, title: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined title is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, title: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty description is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, description: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty description with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, description: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null description is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, description: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined description is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, description: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty semester is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, semester: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty semester with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, semester: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null semester is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, semester: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined semester is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, semester: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty year is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, year: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty year with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, year: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null year is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, year: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined year is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, year: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty topicsOfInterest is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, topicsOfInterest: [] })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null topicsOfInterest is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, topicsOfInterest: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined topicsOfInterest is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, topicsOfInterest: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty openDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, openDate: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty openDate with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, openDate: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null openDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, openDate: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined openDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, openDate: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty closeDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, closeDate: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty closeDate with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, closeDate: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null closeDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, closeDate: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined closeDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, closeDate: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty evaluationEndDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, evaluationEndDate: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty evaluationEndDate with blank space is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, evaluationEndDate: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null evaluationEndDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, evaluationEndDate: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined evaluationEndDate is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, evaluationEndDate: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if blank course name is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, course: { id: 'any_id', name: '' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined course name is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, course: { id: 'any_id', name: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null course name is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, course: { id: 'any_id', name: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if blank course id is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, course: { id: '', name: 'any_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined course id is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, course: { id: undefined, name: 'any_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null course id is sent', () => {
    const result = systemUnderTest.validate({ ...baseNotice, course: { id: null, name: 'any_name' } })

    expect(result).toEqual(new ValidationError([]))
  })
})
