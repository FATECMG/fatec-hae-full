import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'
import ProjectDTOZodValidation from '@functions/project/adapter/validation/ProjectZodValidation'
import { type ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'

describe('ProjectDTOZodValidation', () => {
  let systemUnderTest: ProjectDTOZodValidation
  let baseProject: ProjectDTO

  beforeAll(() => {
    systemUnderTest = new ProjectDTOZodValidation()

    baseProject = {
      author: {
        id: 'any_id',
        name: 'any_name'
      },
      complianceModel: 'any_compliance_model',
      description: 'any_description_any_description',
      justification: 'any_justification_any_justification',
      methodology: 'any_methodology_any_methodology',
      notice: {
        id: 'any_id',
        title: 'any_title'
      },
      objectives: 'any_objectives_any_objectives',
      proposedHours: 'any_proposed_hours',
      references: 'any_references_any_references',
      schedule: 'any_schedule',
      title: 'any_title',
      topicsOfInterest: ['any_topic_of_interest'],
      status: 'DRAFT',
      active: true
    }
  })

  it('should return undefined if the course is valid', () => {
    const result = systemUnderTest.validate(baseProject)

    expect(result).toBeUndefined()
  })

  it('should return undefined if undefined active is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, active: undefined })

    expect(result).toBeUndefined()
  })

  it('should return ValidationError if empty author is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: {} })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null author is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined author is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author without name is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: { id: 'any_id' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author without id is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: { name: 'any_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author with null name is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: { id: 'any_id', name: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author with null id is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: { id: null, name: 'any_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author with undefined name is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: { id: 'any_id', name: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author with undefined id is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, author: { id: undefined, name: 'any_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty complianceModel is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, complianceModel: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null complianceModel is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, complianceModel: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined complianceModel is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, complianceModel: undefined })

    expect(result).toEqual(new ValidationError([]))
  })
  it('should return ValidationError if description is sent with less that 20 characters', () => {
    const result = systemUnderTest.validate({ ...baseProject, description: 'any_desc' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty description is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, description: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null description is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, description: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined description is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, description: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if justification is sent with less than 20 characters', () => {
    const result = systemUnderTest.validate({ ...baseProject, justification: 'any_just' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty justification is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, justification: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null justification is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, justification: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined justification is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, justification: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if methodology is sent with less than 20 characters', () => {
    const result = systemUnderTest.validate({ ...baseProject, methodology: 'any_method' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty methodology is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, methodology: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null methodology is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, methodology: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined methodology is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, methodology: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty notice is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: {} })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null notice is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined notice is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if notice without title is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: { id: 'any_id' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if notice without id is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: { title: 'any_title' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if notice with null title is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: { id: 'any_id', title: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if notice with null id is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: { id: null, title: 'any_title' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if notice with undefined title is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: { id: 'any_id', title: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if notice with undefined id is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, notice: { id: undefined, title: 'any_title' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if objectives is sent with less than 20 characters', () => {
    const result = systemUnderTest.validate({ ...baseProject, objectives: 'any_obj' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty objectives is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, objectives: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null objectives is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, objectives: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined objectives is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, objectives: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty proposedHours is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, proposedHours: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null proposedHours is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, proposedHours: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined proposedHours is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, proposedHours: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if references is sent with less than 20 characters', () => {
    const result = systemUnderTest.validate({ ...baseProject, references: 'any_ref' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty references is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, references: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null references is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, references: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined references is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, references: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, schedule: [] })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, schedule: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, schedule: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if invalid schedule is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, schedule: ['invalid_schedule'] })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty title is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, title: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null title is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, title: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined title is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, title: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty topicsOfInterest is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, topicsOfInterest: [] })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null topicsOfInterest is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, topicsOfInterest: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined topicsOfInterest is sent', () => {
    const result = systemUnderTest.validate({ ...baseProject, topicsOfInterest: undefined })

    expect(result).toEqual(new ValidationError([]))
  })
})
